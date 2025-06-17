import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../interfaces/product-repository.interface';
import {
  ExternalServiceException,
  ProductNotFoundException,
} from '../../delivery/exceptions';
import { IGetProductsUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
import { Product } from '../../domain/entities/product.entity';
import { PaginatedResponse } from '../../domain/entities/pagination.entity';
import { PaginationQuery } from '../../delivery/dtos/firebase-product.dto';

@Injectable()
export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    pagination?: PaginationQuery,
  ): Promise<
    Result<PaginatedResponse<Product>, ExternalServiceException | Error>
  > {
    return await this.productRepository.getProducts(pagination);
  }

  async executeById(
    id: string,
  ): Promise<
    Result<
      Product | null,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    return await this.productRepository.getProductById(id);
  }
}
