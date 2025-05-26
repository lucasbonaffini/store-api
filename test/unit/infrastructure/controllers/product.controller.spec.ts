/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../../src/application/product/delivery/controllers/product.controller';
import { ProductService } from '../../../../src/application/product/use-cases/product.service';
import {
  CreateProductDto,
  UpdateStockDto,
} from '../../../../src/application/product/delivery/dtos/product.dto';
import { Product } from '../../../../src/application/product/domain/entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

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

  // Mock product JSON for responses
  const mockProductJson = mockProductEntity.toJSON();
  const mockProductsJson = [mockProductJson];

  // Mock productService implementation
  const mockProductService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findById: jest.fn().mockResolvedValue(mockProductEntity),
    create: jest.fn().mockResolvedValue(mockProductEntity),
    updateStock: jest.fn().mockResolvedValue(mockProductEntity),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockProductsJson);
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockProductEntity.toJSON());
      expect(productService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productDto: CreateProductDto = {
        title: mockProduct.title,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        image: mockProduct.image,
        stock: mockProduct.stock,
      };

      const result = await controller.create(productDto);
      expect(result).toEqual(mockProductJson);
      expect(productService.create).toHaveBeenCalledWith(productDto);
    });
  });

  describe('updateStock', () => {
    it('should update a product stock', async () => {
      const stockDto: UpdateStockDto = {
        stock: 50,
      };

      const result = await controller.updateStock(1, stockDto);
      expect(result).toEqual(mockProductEntity.toJSON());
      expect(productService.updateStock).toHaveBeenCalledWith(1, stockDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      await controller.remove(1);
      expect(productService.delete).toHaveBeenCalledWith(1);
    });
  });
});
