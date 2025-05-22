import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../data/repositories/product-repository.interface';
import { CreateProductDto } from '../../../dtos/product.dto';
import { ICreateProductUseCase } from '../interfaces/product-use-case.interface';
import { InvalidProductDataException } from '../../domain/exceptions';
import { Result } from 'src/application/types/result';
@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    createProductDto: CreateProductDto,
  ): Promise<Result<Product, InvalidProductDataException>> {
    const stock = createProductDto.stock || Math.floor(Math.random() * 100) + 1;
    const product = Product.create(
      createProductDto.title,
      createProductDto.price,
      createProductDto.description,
      createProductDto.category,
      createProductDto.image,
      stock,
    );
    const createdProduct = await this.productRepository.create(product);

    await this.cacheManager.del('all_products');

    return { type: 'success', value: createdProduct };
  }
}
