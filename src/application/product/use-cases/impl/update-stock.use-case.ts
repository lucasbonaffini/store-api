import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { ProductNotFoundException } from '../../domain/exceptions';
import { IUpdateStockUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';
@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    id: number,
    stock: number,
  ): Promise<Result<Product, ProductNotFoundException>> {
    const productExists = await this.productRepository.exists(id);

    if (!productExists) {
      const error = new ProductNotFoundException(id);
      return { type: 'error', throwable: error };
    }

    const updatedProduct = await this.productRepository.updateStock(id, stock);

    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('all_products');

    return { type: 'success', value: updatedProduct };
  }
}
