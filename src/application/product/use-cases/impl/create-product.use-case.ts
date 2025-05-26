import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../data/repositories/interfaces/product-repository.interface';
import {
  CreateProductDto,
  ProductResponseDto,
} from '../../delivery/dtos/product.dto';
import { ICreateProductUseCase } from '../interfaces/product-use-case.interface';
import {
  InvalidProductDataException,
  DatabaseException,
} from '../../domain/exceptions';
import { Result } from 'src/application/types/result';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    createProductDto: CreateProductDto,
  ): Promise<
    Result<ProductResponseDto, InvalidProductDataException | DatabaseException>
  > {
    const stock = createProductDto.stock || Math.floor(Math.random() * 100) + 1;

    const product = Product.create(
      createProductDto.title,
      createProductDto.price,
      createProductDto.description,
      createProductDto.category,
      createProductDto.image,
      stock,
    );

    return await this.productRepository.createProduct(product);
  }
}
