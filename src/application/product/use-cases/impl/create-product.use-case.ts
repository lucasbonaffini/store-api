import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { CreateProductDto } from '../../delivery/dtos/product.dto';
import { ICreateProductUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { InvalidProductDataException } from '../../delivery/exceptions';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    createProductDto: CreateProductDto,
  ): Promise<Result<Product, InvalidProductDataException | Error>> {
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
