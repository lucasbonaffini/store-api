/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { FakeStoreService } from '../../../../infrastructure/adapters/fakestore/fakestore.service';
import { ExternalServiceException } from '../../domain/exceptions';
import { IGetProductsUseCase } from '../interfaces/product-use-case.interface';

@Injectable()
export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(FakeStoreService)
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(): Promise<Product[]> {
    const cachedProducts =
      await this.cacheManager.get<Product[]>('all_products');
    if (cachedProducts) {
      return cachedProducts;
    }

    const localProducts = await this.productRepository.findAll();

    if (localProducts.length > 0) {
      await this.cacheManager.set('all_products', localProducts, 3600);
      return localProducts;
    }

    try {
      const fakeStoreProducts = await this.fakeStoreService.getProducts();
      const products = fakeStoreProducts.map((product) =>
        Product.fromFakeStore(product),
      );

      await this.cacheManager.set('all_products', products, 3600);
      return products;
    } catch (error) {
      throw new ExternalServiceException('FakeStore API', error);
    }
  }
}
