import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../use-cases/interfaces/product-repository.interface';
import { IProductDataSource } from './interfaces/product-datasource.interface';
import { FakeStoreDataSource } from '../../infrastructure/datasources/adapters/fakestore/fakestore.datasource';
import { ProductResponseMapper } from '../mappers/product-response.mapper';
import { PrismaToEntityMapper } from '../mappers/prisma-to-entity.mapper';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../domain/exceptions';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject('IProductDataSource')
    private readonly prismaDataSource: IProductDataSource,
    @Inject(FakeStoreDataSource)
    private readonly fakeStoreDataSource: FakeStoreDataSource,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(ProductResponseMapper)
    private readonly responseMapper: ProductResponseMapper,
    @Inject(PrismaToEntityMapper)
    private readonly entityMapper: PrismaToEntityMapper,
  ) {}

  async getProducts(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | Error>
  > {
    const cachedProducts =
      await this.cacheManager.get<ProductResponseDto[]>('all_products');
    if (cachedProducts) {
      return { type: 'success', value: cachedProducts };
    }

    const localProductsResult = await this.prismaDataSource.findAll();

    if (localProductsResult.type === 'error') {
      return localProductsResult;
    }

    const localPrismaData = localProductsResult.value;

    if (localPrismaData.length > 0) {
      const localProducts =
        this.entityMapper.toDomainEntityList(localPrismaData);
      const responseDto = this.responseMapper.toResponseDtoList(localProducts);
      await this.cacheManager.set('all_products', responseDto, 3600);
      return { type: 'success', value: responseDto };
    }

    const fakeStoreProducts = await this.fakeStoreDataSource.getProducts();
    const products = fakeStoreProducts.map((product) =>
      Product.fromFakeStore(product),
    );

    const responseDto = this.responseMapper.toResponseDtoList(products);
    await this.cacheManager.set('all_products', responseDto, 3600);
    return { type: 'success', value: responseDto };
  }

  async getProductById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    const cacheKey = `product_${id}`;

    const cachedProduct =
      await this.cacheManager.get<ProductResponseDto>(cacheKey);
    if (cachedProduct) {
      return { type: 'success', value: cachedProduct };
    }

    const localProductResult = await this.prismaDataSource.findById(id);

    if (localProductResult.type === 'error') {
      return localProductResult;
    }

    const localPrismaData = localProductResult.value;

    if (localPrismaData) {
      const localProduct = this.entityMapper.toDomainEntity(localPrismaData);
      const responseDto = this.responseMapper.toResponseDto(localProduct);
      await this.cacheManager.set(cacheKey, responseDto, 3600);
      return { type: 'success', value: responseDto };
    }

    const fakeStoreProduct = await this.fakeStoreDataSource.getProductById(id);

    if (!fakeStoreProduct) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const product = Product.fromFakeStore(fakeStoreProduct);
    const responseDto = this.responseMapper.toResponseDto(product);

    await this.cacheManager.set(cacheKey, responseDto, 3600);
    return { type: 'success', value: responseDto };
  }

  async createProduct(
    product: Product,
  ): Promise<Result<ProductResponseDto, Error>> {
    const createPrismaDto =
      this.entityMapper.fromDomainEntityToCreateDto(product);
    const createdProductResult =
      await this.prismaDataSource.create(createPrismaDto);

    if (createdProductResult.type === 'error') {
      return createdProductResult;
    }

    const createdPrismaData = createdProductResult.value;
    const createdProduct = this.entityMapper.toDomainEntity(createdPrismaData);
    const responseDto = this.responseMapper.toResponseDto(createdProduct);

    await this.cacheManager.del('all_products');

    return { type: 'success', value: responseDto };
  }

  async updateStock(
    id: number,
    stock: number,
  ): Promise<Result<ProductResponseDto, ProductNotFoundException | Error>> {
    const productExistsResult = await this.prismaDataSource.exists(id);

    if (productExistsResult.type === 'error') {
      return productExistsResult;
    }

    if (!productExistsResult.value) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const updatedProductResult = await this.prismaDataSource.updateStock(
      id,
      stock,
    );

    if (updatedProductResult.type === 'error') {
      return updatedProductResult;
    }

    const updatedPrismaData = updatedProductResult.value;
    const updatedProduct = this.entityMapper.toDomainEntity(updatedPrismaData);
    const responseDto = this.responseMapper.toResponseDto(updatedProduct);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return { type: 'success', value: responseDto };
  }

  async deleteProduct(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | Error>> {
    const productExistsResult = await this.prismaDataSource.exists(id);

    if (productExistsResult.type === 'error') {
      return productExistsResult;
    }

    if (!productExistsResult.value) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const deleteResult = await this.prismaDataSource.delete(id);

    if (deleteResult.type === 'error') {
      return deleteResult;
    }

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return { type: 'success', value: undefined };
  }
}
