import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../use-cases/interfaces/product-repository.interface';
import { FirebaseProductDataSource } from '../../infrastructure/datasources/firebase/product.firestore.datasource';
import { FakeStoreDataSource } from '../../infrastructure/datasources/adapters/fakestore/fakestore.datasource';
import { FirebaseResponseMapper } from '../mappers/firebase-response.mapper';
import { FirebaseToEntityMapper } from '../mappers/firebase-to-entity.mapper';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { PaginationQuery } from '../../delivery/dtos/firebase-product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../delivery/exceptions';
import { Result } from 'src/application/core/types/result';
import {
  PaginatedApiResponse,
  ApiResponse,
  PaginationMeta,
} from '../../delivery/dtos/firebase-product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject(FirebaseProductDataSource)
    private readonly firebaseDataSource: FirebaseProductDataSource,
    @Inject(FakeStoreDataSource)
    private readonly fakeStoreDataSource: FakeStoreDataSource,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(FirebaseResponseMapper)
    private readonly responseMapper: FirebaseResponseMapper,
    @Inject(FirebaseToEntityMapper)
    private readonly entityMapper: FirebaseToEntityMapper,
  ) {}

  async getProducts(
    pagination?: PaginationQuery,
  ): Promise<
    Result<
      PaginatedApiResponse<ProductResponseDto>,
      ExternalServiceException | Error
    >
  > {
    const limit = pagination?.limit || 10;
    const page = pagination?.page || 1;
    const skip = (page - 1) * limit;
    const cacheKey = `products_${limit}_${page}`;

    const cachedProducts =
      await this.cacheManager.get<PaginatedApiResponse<ProductResponseDto>>(
        cacheKey,
      );
    if (cachedProducts) {
      return { type: 'success', value: cachedProducts };
    }

    const firebaseResult = await this.firebaseDataSource.findAll(limit, skip);

    if (firebaseResult.type === 'error') {
      return {
        type: 'error',
        throwable: firebaseResult.throwable,
      };
    }

    const firebaseData = firebaseResult.value;

    if (firebaseData.data.length > 0) {
      const products = this.entityMapper.toDomainEntityList(firebaseData.data);
      const responseDtos = this.responseMapper.toResponseDtoList(products);

      const response = this.responseMapper.toPaginatedApiResponse(
        responseDtos,
        firebaseData.pagination,
      );

      await this.cacheManager.set(cacheKey, response, 3600);
      return { type: 'success', value: response };
    }

    const fakeStoreProducts = await this.fakeStoreDataSource.getProducts();
    const products = fakeStoreProducts
      .slice(0, limit)
      .map((product) => Product.fromFakeStore(product));

    const responseDtos = this.responseMapper.toResponseDtoList(products);

    const paginationMeta: PaginationMeta = {
      hasNextPage: fakeStoreProducts.length > limit,
      nextCursor: null,
      currentPage: 'first',
      totalInPage: responseDtos.length,
    };

    const response = this.responseMapper.toPaginatedApiResponse(
      responseDtos,
      paginationMeta,
    );

    await this.cacheManager.set(cacheKey, response, 3600);
    return { type: 'success', value: response };
  }

  async getProductById(
    id: string,
  ): Promise<
    Result<
      ApiResponse<ProductResponseDto>,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    const cacheKey = `product_${id}`;

    const cachedProduct =
      await this.cacheManager.get<ApiResponse<ProductResponseDto>>(cacheKey);
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
      const product = this.entityMapper.toDomainEntity(firebaseData);
      const responseDto = this.responseMapper.toResponseDto(product);
      const response = this.responseMapper.toApiResponse(responseDto);

      await this.cacheManager.set(cacheKey, response, 3600);
      return { type: 'success', value: response };
    }

    const fakeStoreProduct = await this.fakeStoreDataSource.getProductById(
      parseInt(id),
    );

    if (!fakeStoreProduct) {
      const error = new ProductNotFoundException(id);
      const errorResponse =
        this.responseMapper.toApiResponse<ProductResponseDto>(
          null,
          error.message,
        );
      return { type: 'success', value: errorResponse };
    }

    const product = Product.fromFakeStore(fakeStoreProduct);
    const responseDto = this.responseMapper.toResponseDto(product);
    const response = this.responseMapper.toApiResponse(responseDto);

    await this.cacheManager.set(cacheKey, response, 3600);
    return { type: 'success', value: response };
  }

  async createProduct(
    product: Product,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>> {
    const createFirebaseDto =
      this.entityMapper.fromDomainEntityToCreateDto(product);
    const createdResult =
      await this.firebaseDataSource.create(createFirebaseDto);

    if (createdResult.type === 'error') {
      const errorResponse =
        this.responseMapper.toApiResponse<ProductResponseDto>(
          null,
          createdResult.throwable.message,
        );
      return { type: 'success', value: errorResponse };
    }

    const createdFirebaseData = createdResult.value;
    const createdProduct =
      this.entityMapper.toDomainEntity(createdFirebaseData);
    const responseDto = this.responseMapper.toResponseDto(createdProduct);
    const response = this.responseMapper.toApiResponse(responseDto);

    await this.cacheManager.del('products_*');

    return { type: 'success', value: response };
  }

  async updateStock(
    id: string,
    stock: number,
  ): Promise<
    Result<ApiResponse<ProductResponseDto>, ProductNotFoundException | Error>
  > {
    const existsResult = await this.firebaseDataSource.exists(id);

    if (existsResult.type === 'error') {
      const errorResponse =
        this.responseMapper.toApiResponse<ProductResponseDto>(
          null,
          existsResult.throwable.message,
        );
      return { type: 'success', value: errorResponse };
    }

    if (!existsResult.value) {
      const errorResponse =
        this.responseMapper.toApiResponse<ProductResponseDto>(
          null,
          `Product with id ${id} not found`,
        );
      return { type: 'success', value: errorResponse };
    }

    const updatedResult = await this.firebaseDataSource.updateStock(id, stock);

    if (updatedResult.type === 'error') {
      const errorResponse =
        this.responseMapper.toApiResponse<ProductResponseDto>(
          null,
          updatedResult.throwable.message,
        );
      return { type: 'success', value: errorResponse };
    }

    const updatedFirebaseData = updatedResult.value;
    const updatedProduct =
      this.entityMapper.toDomainEntity(updatedFirebaseData);
    const responseDto = this.responseMapper.toResponseDto(updatedProduct);
    const response = this.responseMapper.toApiResponse(responseDto);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products_*');

    return { type: 'success', value: response };
  }

  async deleteProduct(
    id: string,
  ): Promise<Result<ApiResponse<void>, ProductNotFoundException | Error>> {
    const existsResult = await this.firebaseDataSource.exists(id);

    if (existsResult.type === 'error') {
      const errorResponse = this.responseMapper.toApiResponse<void>(
        null,
        existsResult.throwable.message,
      );
      return { type: 'success', value: errorResponse };
    }

    if (!existsResult.value) {
      const errorResponse = this.responseMapper.toApiResponse<void>(
        null,
        `Product with id ${id} not found`,
      );
      return { type: 'success', value: errorResponse };
    }

    const deleteResult = await this.firebaseDataSource.delete(id);

    if (deleteResult.type === 'error') {
      const errorResponse = this.responseMapper.toApiResponse<void>(
        null,
        deleteResult.throwable.message,
      );
      return { type: 'success', value: errorResponse };
    }

    const response = this.responseMapper.toApiResponse<void>(undefined);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products_*');

    return { type: 'success', value: response };
  }
}
