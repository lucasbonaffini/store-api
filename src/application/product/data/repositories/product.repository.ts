import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from './interfaces/product-repository.interface';
import { IProductDataSource } from './../../../../infrastructure/datasource/interfaces/product-datasource.interface';
import { FakeStoreService } from './../../../../infrastructure/adapters/fakestore/fakestore.service';
import { ProductResponseMapper } from '../mappers/product-response.mapper';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
  DatabaseException,
} from '../../domain/exceptions';
import { Result } from '../../../types/result';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject('IProductDataSource')
    private readonly dataSource: IProductDataSource,
    @Inject(FakeStoreService)
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(ProductResponseMapper)
    private readonly mapper: ProductResponseMapper,
  ) {}

  async getProducts(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | DatabaseException>
  > {
    const cachedProducts =
      await this.cacheManager.get<ProductResponseDto[]>('all_products');
    if (cachedProducts) {
      return { type: 'success', value: cachedProducts };
    }

    const localProducts = await this.dataSource.findAll();

    if (localProducts.length > 0) {
      const responseDto = this.mapper.toResponseDtoList(localProducts);
      await this.cacheManager.set('all_products', responseDto, 3600);
      return { type: 'success', value: responseDto };
    }

    const fakeStoreProducts = await this.fakeStoreService.getProducts();
    const products = fakeStoreProducts.map((product) =>
      Product.fromFakeStore(product),
    );

    const responseDto = this.mapper.toResponseDtoList(products);
    await this.cacheManager.set('all_products', responseDto, 3600);
    return { type: 'success', value: responseDto };
  }

  async getProductById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | DatabaseException
    >
  > {
    const cacheKey = `product_${id}`;

    const cachedProduct =
      await this.cacheManager.get<ProductResponseDto>(cacheKey);
    if (cachedProduct) {
      return { type: 'success', value: cachedProduct };
    }

    const localProduct = await this.dataSource.findById(id);

    if (localProduct) {
      const responseDto = this.mapper.toResponseDto(localProduct);
      await this.cacheManager.set(cacheKey, responseDto, 3600);
      return { type: 'success', value: responseDto };
    }

    const fakeStoreProduct = await this.fakeStoreService.getProductById(id);

    if (!fakeStoreProduct) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const product = Product.fromFakeStore(fakeStoreProduct);
    const responseDto = this.mapper.toResponseDto(product);

    await this.cacheManager.set(cacheKey, responseDto, 3600);
    return { type: 'success', value: responseDto };
  }

  async createProduct(
    product: Product,
  ): Promise<Result<ProductResponseDto, DatabaseException>> {
    const createdProduct = await this.dataSource.create(product);
    const responseDto = this.mapper.toResponseDto(createdProduct);

    await this.cacheManager.del('all_products');

    return { type: 'success', value: responseDto };
  }

  async updateStock(
    id: number,
    stock: number,
  ): Promise<
    Result<ProductResponseDto, ProductNotFoundException | DatabaseException>
  > {
    const productExists = await this.dataSource.exists(id);

    if (!productExists) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const updatedProduct = await this.dataSource.updateStock(id, stock);
    const responseDto = this.mapper.toResponseDto(updatedProduct);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return { type: 'success', value: responseDto };
  }

  async deleteProduct(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | DatabaseException>> {
    const productExists = await this.dataSource.exists(id);

    if (!productExists) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    await this.dataSource.delete(id);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return { type: 'success', value: undefined };
  }
}
