import { Injectable, Inject } from '@nestjs/common';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../interfaces/product-repository.interface';
import {
  ExternalServiceException,
  ProductNotFoundException,
} from '../../delivery/exceptions';
import { IGetProductsUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../delivery/dtos/firebase-product.dto';
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
    Result<
      PaginatedApiResponse<ProductResponseDto>,
      ExternalServiceException | Error
    >
  > {
    return await this.productRepository.getProducts(pagination);
  }

  async executeById(
    id: string,
  ): Promise<
    Result<
      ApiResponse<ProductResponseDto>,
      ProductNotFoundException | ExternalServiceException | Error
    >
  > {
    return await this.productRepository.getProductById(id);
  }
}
