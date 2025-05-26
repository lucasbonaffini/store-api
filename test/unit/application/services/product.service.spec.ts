import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../../src/application/product/use-cases/product.service';
import { Product } from '../../../../src/application/product/domain/entities/product.entity';
import {
  CreateProductDto,
  UpdateStockDto,
} from '../../../../src/application/product/delivery/dtos/product.dto';
import { ProductNotFoundException } from '../../../../src/application/product/domain/exceptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FakeStoreService } from '../../../../src/infrastructure/adapters/fakestore/fakestore.service';

describe('ProductService', () => {
  let service: ProductService;

  // Mock product data
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    description: 'Test description',
    category: 'electronics',
    image: 'image-url.jpg',
    stock: 100,
  };

  const mockProductEntity = Product.create(
    mockProduct.title,
    mockProduct.price,
    mockProduct.description,
    mockProduct.category,
    mockProduct.image,
    mockProduct.stock,
    mockProduct.id,
  );

  const mockProducts = [mockProductEntity];

  // Mock repository implementation
  const mockProductRepository = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findById: jest.fn().mockResolvedValue(mockProductEntity),
    create: jest.fn().mockResolvedValue(mockProductEntity),
    update: jest.fn().mockResolvedValue(mockProductEntity),
    updateStock: jest.fn().mockResolvedValue(mockProductEntity),
    delete: jest.fn().mockResolvedValue(true),
    exists: jest.fn().mockResolvedValue(true),
  };

  // Mock cache manager
  const mockCacheManager = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(true),
    del: jest.fn().mockResolvedValue(true),
  };

  // Mock FakeStore service
  const mockFakeStoreService = {
    getProducts: jest.fn().mockResolvedValue([mockProduct]),
    getProductById: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: FakeStoreService,
          useValue: mockFakeStoreService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached products if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockCacheManager.get).toHaveBeenCalledWith('all_products');
      expect(mockProductRepository.findAll).not.toHaveBeenCalled();
    });

    it('should return repository products if not in cache', async () => {
      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockCacheManager.get).toHaveBeenCalledWith('all_products');
      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'all_products',
        mockProducts,
        3600,
      );
    });

    it('should fetch from external API if no local products', async () => {
      mockProductRepository.findAll.mockResolvedValueOnce([]);

      const result = await service.findAll();

      // Just verify a product was returned, don't compare exact values since
      // fromFakeStore creates random stocks and dates
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 1);
      expect(mockFakeStoreService.getProducts).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return cached product if available', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockProductEntity);

      const result = await service.findById(1);

      expect(result).toEqual(mockProductEntity);
      expect(mockCacheManager.get).toHaveBeenCalledWith('product_1');
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
    });

    it('should return repository product if not in cache', async () => {
      const result = await service.findById(1);

      expect(result).toEqual(mockProductEntity);
      expect(mockCacheManager.get).toHaveBeenCalledWith('product_1');
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'product_1',
        mockProductEntity,
        3600,
      );
    });

    it('should fetch from external API if no local product', async () => {
      mockProductRepository.findById.mockResolvedValueOnce(null);

      const result = await service.findById(1);

      // Just verify a product was returned with the right ID
      expect(result).toHaveProperty('id', 1);
      expect(mockFakeStoreService.getProductById).toHaveBeenCalledWith(1);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw ProductNotFoundException if product not found', async () => {
      mockProductRepository.findById.mockResolvedValueOnce(null);
      mockFakeStoreService.getProductById.mockResolvedValueOnce(null);

      await expect(service.findById(999)).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new product and invalidate cache', async () => {
      const dto: CreateProductDto = {
        title: mockProduct.title,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        image: mockProduct.image,
        stock: mockProduct.stock,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockProductEntity);
      expect(mockProductRepository.create).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalledWith('all_products');
    });
  });

  describe('updateStock', () => {
    it('should update stock and invalidate cache', async () => {
      const dto: UpdateStockDto = { stock: 50 };

      const result = await service.updateStock(1, dto);

      expect(result).toEqual(mockProductEntity);
      expect(mockProductRepository.exists).toHaveBeenCalledWith(1);
      expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, 50);
      expect(mockCacheManager.del).toHaveBeenCalledWith('product_1');
      expect(mockCacheManager.del).toHaveBeenCalledWith('all_products');
    });

    it('should throw ProductNotFoundException if product not found', async () => {
      mockProductRepository.exists.mockResolvedValueOnce(false);
      const dto: UpdateStockDto = { stock: 50 };

      await expect(service.updateStock(999, dto)).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete product and invalidate cache', async () => {
      await service.delete(1);

      expect(mockProductRepository.exists).toHaveBeenCalledWith(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(mockCacheManager.del).toHaveBeenCalledWith('product_1');
      expect(mockCacheManager.del).toHaveBeenCalledWith('all_products');
    });

    it('should throw ProductNotFoundException if product not found', async () => {
      mockProductRepository.exists.mockResolvedValueOnce(false);

      await expect(service.delete(999)).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });
});
