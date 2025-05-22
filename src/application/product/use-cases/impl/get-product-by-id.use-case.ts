import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { FakeStoreService } from '../../../../infrastructure/adapters/fakestore/fakestore.service';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../domain/exceptions';
import { IGetProductByIdUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class GetProductByIdUseCase implements IGetProductByIdUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(FakeStoreService)
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    id: number,
  ): Promise<
    Result<Product, ProductNotFoundException | ExternalServiceException>
  > {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return { type: 'success', value: cachedProduct };
    }

    const localProduct = await this.productRepository.findById(id);

    if (localProduct) {
      await this.cacheManager.set(cacheKey, localProduct, 3600);
      return { type: 'success', value: localProduct };
    }

    try {
      const fakeStoreProduct = await this.fakeStoreService.getProductById(id);

      if (!fakeStoreProduct) {
        const error = new ProductNotFoundException(id);
        return { type: 'error', throwable: error };
      }

      const product = Product.fromFakeStore(fakeStoreProduct);

      await this.cacheManager.set(cacheKey, product, 3600);
      return { type: 'success', value: product };
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        return { type: 'error', throwable: error };
      }
      const serviceError =
        error instanceof Error ? error : new Error(String(error));
      const externalError = new ExternalServiceException(
        'FakeStore API',
        serviceError,
      );
      return { type: 'error', throwable: externalError };
    }
  }
}
