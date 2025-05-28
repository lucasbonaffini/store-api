import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../interfaces/product-repository.interface';
import {
  ExternalServiceException,
  ProductNotFoundException,
} from '../../domain/exceptions';
import { IGetProductsUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | Error>
  > {
    return await this.productRepository.getProducts();
  }
  async executeById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    return await this.productRepository.getProductById(id);
  }
}
