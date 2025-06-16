import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { PaginatedResponse } from '../../domain/entities/pagination.entity';
import { IProductRepository } from '../../use-cases/interfaces/product-repository.interface';
import { FirebaseProductDataSource } from '../../infrastructure/datasources/firebase/product.firestore.datasource';
import { FakeStoreDataSource } from '../../infrastructure/datasources/adapters/fakestore/fakestore.datasource';
import { FirebaseToEntityMapper } from '../../delivery/mappers/firebase-to-entity.mapper';
import { FakeStoreToEntityMapper } from '../../infrastructure/mappers/fakestore-to-entity.mapper';
import { PaginationQuery } from '../../delivery/dtos/firebase-product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../delivery/exceptions';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject(FirebaseProductDataSource)
    private readonly firebaseDataSource: FirebaseProductDataSource,
    @Inject(FakeStoreDataSource)
    private readonly fakeStoreDataSource: FakeStoreDataSource,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(FirebaseToEntityMapper)
    private readonly firebaseEntityMapper: FirebaseToEntityMapper,
    @Inject(FakeStoreToEntityMapper)
    private readonly fakeStoreEntityMapper: FakeStoreToEntityMapper,
  ) {}

  async getProducts(
    pagination?: PaginationQuery,
  ): Promise<
    Result<PaginatedResponse<Product>, ExternalServiceException | Error>
  > {
    const limit = pagination?.limit || 10;
    const cursor = pagination?.cursor;
    const cacheKey = `products_${limit}_${cursor || 'first'}`;

    const cachedProducts =
      await this.cacheManager.get<PaginatedResponse<Product>>(cacheKey);
    if (cachedProducts) {
      return { type: 'success', value: cachedProducts };
    }

    const firebaseResult = await this.firebaseDataSource.findAll(limit, cursor);

    if (firebaseResult.type === 'error') {
      return {
        type: 'error',
        throwable: firebaseResult.throwable,
      };
    }

    const firebaseData = firebaseResult.value;

    if (firebaseData.data.length > 0) {
      const products = this.firebaseEntityMapper.toDomainEntityList(
        firebaseData.data,
      );

      const response: PaginatedResponse<Product> = {
        data: products,
        pagination: firebaseData.pagination,
      };

      await this.cacheManager.set(cacheKey, response, 3600);
      return { type: 'success', value: response };
    }

    const fakeStoreProducts = await this.fakeStoreDataSource.getProducts();
    const products = this.fakeStoreEntityMapper.toDomainEntityList(
      fakeStoreProducts.slice(0, limit),
    );

    const response: PaginatedResponse<Product> = {
      data: products,
      pagination: {
        hasNextPage: fakeStoreProducts.length > limit,
        nextCursor: null,
        totalInPage: products.length,
      },
    };

    await this.cacheManager.set(cacheKey, response, 3600);
    return { type: 'success', value: response };
  }

  async getProductById(
    id: string,
  ): Promise<
    Result<
      Product | null,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    const cacheKey = `product_${id}`;

    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
    if (cachedProduct) {
      return { type: 'success', value: cachedProduct };
    }

    const firebaseResult = await this.firebaseDataSource.findById(id);

    if (firebaseResult.type === 'error') {
      return {
        type: 'error',
        throwable: firebaseResult.throwable,
      };
    }

    const firebaseData = firebaseResult.value;

    if (firebaseData) {
      const product = this.firebaseEntityMapper.toDomainEntity(firebaseData);
      await this.cacheManager.set(cacheKey, product, 3600);
      return { type: 'success', value: product };
    }

    const fakeStoreProduct = await this.fakeStoreDataSource.getProductById(
      parseInt(id),
    );

    if (!fakeStoreProduct) {
      return { type: 'success', value: null };
    }

    const product = this.fakeStoreEntityMapper.toDomainEntity(fakeStoreProduct);
    await this.cacheManager.set(cacheKey, product, 3600);
    return { type: 'success', value: product };
  }

  async createProduct(product: Product): Promise<Result<Product, Error>> {
    const createFirebaseEntity =
      this.firebaseEntityMapper.fromDomainEntityToCreateEntity(product);
    const createdResult =
      await this.firebaseDataSource.create(createFirebaseEntity);

    if (createdResult.type === 'error') {
      return {
        type: 'error',
        throwable: createdResult.throwable,
      };
    }

    const createdFirebaseData = createdResult.value;
    const createdProduct =
      this.firebaseEntityMapper.toDomainEntity(createdFirebaseData);

    await this.cacheManager.del('products_*');

    return { type: 'success', value: createdProduct };
  }

  async updateStock(
    id: string,
    stock: number,
  ): Promise<Result<Product, ProductNotFoundException | Error>> {
    const existsResult = await this.firebaseDataSource.exists(id);

    if (existsResult.type === 'error') {
      return {
        type: 'error',
        throwable: existsResult.throwable,
      };
    }

    if (!existsResult.value) {
      return {
        type: 'error',
        throwable: new ProductNotFoundException(id),
      };
    }

    const updatedResult = await this.firebaseDataSource.updateStock(id, stock);

    if (updatedResult.type === 'error') {
      return {
        type: 'error',
        throwable: updatedResult.throwable,
      };
    }

    const updatedFirebaseData = updatedResult.value;
    const updatedProduct =
      this.firebaseEntityMapper.toDomainEntity(updatedFirebaseData);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products_*');

    return { type: 'success', value: updatedProduct };
  }

  async deleteProduct(
    id: string,
  ): Promise<Result<void, ProductNotFoundException | Error>> {
    const existsResult = await this.firebaseDataSource.exists(id);

    if (existsResult.type === 'error') {
      return {
        type: 'error',
        throwable: existsResult.throwable,
      };
    }

    if (!existsResult.value) {
      return {
        type: 'error',
        throwable: new ProductNotFoundException(id),
      };
    }

    const deleteResult = await this.firebaseDataSource.delete(id);

    if (deleteResult.type === 'error') {
      return {
        type: 'error',
        throwable: deleteResult.throwable,
      };
    }

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products_*');

    return { type: 'success', value: undefined };
  }
}
