import { CreateProductDto, UpdateStockDto } from '../../dtos/product.dto';
import { PaginationQuery } from '../../dtos/firebase-product.dto';
import { Product } from '../../../domain/entities/product.entity';
import { PaginatedResponse } from '../../../domain/entities/pagination.entity';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../exceptions';
import { Result } from '../../../../core/types/result';

export interface IGetProductsUseCase {
  execute(
    pagination?: PaginationQuery,
  ): Promise<
    Result<PaginatedResponse<Product>, ExternalServiceException | Error>
  >;
  executeById(
    id: string,
  ): Promise<
    Result<
      Product | null,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
}

export interface ICreateProductUseCase {
  execute(createProductDto: CreateProductDto): Promise<Result<Product, Error>>;
}

export interface IUpdateStockUseCase {
  execute(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<Product, ProductNotFoundException | Error>>;
}

export interface IDeleteProductUseCase {
  execute(id: string): Promise<Result<void, ProductNotFoundException | Error>>;
}
