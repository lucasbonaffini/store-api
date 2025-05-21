import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { FakeStoreService } from '../../../../infrastructure/adapters/fakestore/fakestore.service';
import { ProductNotFoundException } from '../../domain/exceptions';
import { IDeleteProductUseCase } from '../interfaces/product-use-case.interface';

@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(id: number): Promise<void> {
    const productExists = await this.productRepository.exists(id);

    if (!productExists) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepository.delete(id);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');
  }
}
