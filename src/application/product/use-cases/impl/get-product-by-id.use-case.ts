import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../../data/repositories/interfaces/product-repository.interface';
import {
  ProductNotFoundException,
  ExternalServiceException,
  DatabaseException,
} from '../../domain/exceptions';
import { IGetProductByIdUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class GetProductByIdUseCase implements IGetProductByIdUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | DatabaseException
    >
  > {
    return await this.productRepository.getProductById(id);
  }
}
