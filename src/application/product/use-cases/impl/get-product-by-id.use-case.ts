/* eslint-disable @typescript-eslint/no-unsafe-argument*/
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

@Injectable()
export class GetProductByIdUseCase implements IGetProductByIdUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(id: number): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const localProduct = await this.productRepository.findById(id);

    if (localProduct) {
      await this.cacheManager.set(cacheKey, localProduct, 3600);
      return localProduct;
    }

    try {
      const fakeStoreProduct = await this.fakeStoreService.getProductById(id);

      if (!fakeStoreProduct) {
        throw new ProductNotFoundException(id);
      }

      const product = Product.fromFakeStore(fakeStoreProduct);

      await this.cacheManager.set(cacheKey, product, 3600);
      return product;
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      throw new ExternalServiceException('FakeStore API', error);
    }
  }
}
