import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from '../../dtos/product.dto';
import { PaginationQuery } from '../../dtos/firebase-product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../exceptions';
import { Result } from '../../../../core/types/result';
import {
  PaginatedApiResponse,
  ApiResponse,
} from '../../dtos/firebase-product.dto';

export interface IGetProductsUseCase {
  execute(
    pagination?: PaginationQuery,
  ): Promise<
    Result<
      PaginatedApiResponse<ProductResponseDto>,
      ExternalServiceException | Error
    >
  >;
  executeById(
    id: string,
  ): Promise<
    Result<
      ApiResponse<ProductResponseDto>,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
}

export interface ICreateProductUseCase {
  execute(
    createProductDto: CreateProductDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>>;
}

export interface IUpdateStockUseCase {
  execute(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<
    Result<ApiResponse<ProductResponseDto>, ProductNotFoundException | Error>
  >;
}

export interface IDeleteProductUseCase {
  execute(
    id: string,
  ): Promise<Result<ApiResponse<void>, ProductNotFoundException | Error>>;
}
