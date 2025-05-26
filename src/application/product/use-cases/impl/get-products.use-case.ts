import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../../data/repositories/interfaces/product-repository.interface';
import {
  ExternalServiceException,
  DatabaseException,
} from '../../domain/exceptions';
import { IGetProductsUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | DatabaseException>
  > {
    return await this.productRepository.getProducts();
  }
}
