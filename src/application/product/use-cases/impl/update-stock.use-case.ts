import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { FakeStoreService } from '../../../../infrastructure/adapters/fakestore/fakestore.service';
import { ProductNotFoundException } from '../../domain/exceptions';
import { IUpdateStockUseCase } from '../interfaces/product-use-case.interface';

@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly fakeStoreService: FakeStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(id: number, stock: number): Promise<Product> {
    const productExists = await this.productRepository.exists(id);

    if (!productExists) {
      throw new ProductNotFoundException(id);
    }

    const updatedProduct = await this.productRepository.updateStock(id, stock);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return updatedProduct;
  }
}
