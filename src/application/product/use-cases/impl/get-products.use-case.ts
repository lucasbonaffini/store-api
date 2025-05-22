/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { FakeStoreService } from '../../../../infrastructure/adapters/fakestore/fakestore.service';
import { ExternalServiceException } from '../../domain/exceptions';
import { IGetProductsUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(FakeStoreService)
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(): Promise<Result<Product[], ExternalServiceException>> {
    const cachedProducts =
      await this.cacheManager.get<Product[]>('all_products');
    if (cachedProducts) {
      return { type: 'success', value: cachedProducts };
    }

    const localProducts = await this.productRepository.findAll();

    if (localProducts.length > 0) {
      await this.cacheManager.set('all_products', localProducts, 3600);
      return { type: 'success', value: localProducts };
    }

    try {
      const fakeStoreProducts = await this.fakeStoreService.getProducts();
      const products = fakeStoreProducts.map((product) =>
        Product.fromFakeStore(product),
      );

      await this.cacheManager.set('all_products', products, 3600);
      return { type: 'success', value: products };
    } catch (error) {
      const externalError = new ExternalServiceException(
        'FakeStore API',
        error,
      );
      return { type: 'error', throwable: externalError };
    }
  }
}
