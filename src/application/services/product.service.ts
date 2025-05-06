/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product-repository.interface';
import { CreateProductDto, UpdateStockDto } from '../dtos/product.dto';
import { FakeStoreService } from '../../infrastructure/adapters/fakestore/fakestore.service';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../domain/exceptions';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Product[]> {
    // Try to get from cache first
    const cachedProducts =
      await this.cacheManager.get<Product[]>('all_products');
    if (cachedProducts) {
      return cachedProducts;
    }

    // If not in cache, get from database
    const localProducts = await this.productRepository.findAll();

    if (localProducts.length > 0) {
      // Store in cache before returning
      await this.cacheManager.set('all_products', localProducts, 3600);
      return localProducts;
    }

    // If not in database, get from external API
    try {
      const fakeStoreProducts = await this.fakeStoreService.getProducts();
      const products = fakeStoreProducts.map((product) =>
        Product.fromFakeStore(product),
      );

      // Store in cache before returning
      await this.cacheManager.set('all_products', products, 3600);
      return products;
    } catch (error) {
      throw new ExternalServiceException('FakeStore API', error);
    }
  }

  async findById(id: number): Promise<Product> {
    // Try to get from cache first
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    // If not in cache, get from database
    const localProduct = await this.productRepository.findById(id);

    if (localProduct) {
      // Store in cache before returning
      await this.cacheManager.set(cacheKey, localProduct, 3600);
      return localProduct;
    }

    // If not in database, get from external API
    try {
      const fakeStoreProduct = await this.fakeStoreService.getProductById(id);

      if (!fakeStoreProduct) {
        throw new ProductNotFoundException(id);
      }

      const product = Product.fromFakeStore(fakeStoreProduct);

      // Store in cache before returning
      await this.cacheManager.set(cacheKey, product, 3600);
      return product;
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      throw new ExternalServiceException('FakeStore API', error);
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const stock = createProductDto.stock || Math.floor(Math.random() * 100) + 1;
    const product = Product.create(
      createProductDto.title,
      createProductDto.price,
      createProductDto.description,
      createProductDto.category,
      createProductDto.image,
      stock,
    );

    const createdProduct = await this.productRepository.create(product);

    // Invalidate cache for all products
    await this.cacheManager.del('all_products');

    return createdProduct;
  }

  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Product> {
    const productExists = await this.productRepository.exists(id);

    if (!productExists) {
      throw new ProductNotFoundException(id);
    }

    const updatedProduct = await this.productRepository.updateStock(
      id,
      updateStockDto.stock,
    );

    // Invalidate cache for this product and all products
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    const productExists = await this.productRepository.exists(id);

    if (!productExists) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepository.delete(id);

    // Invalidate cache for this product and all products
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');
  }
}
