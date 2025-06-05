import { Result } from 'src/application/core/types/result';
import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { PaginationQuery } from '../../delivery/dtos/firebase-product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../delivery/exceptions';
import {
  PaginatedApiResponse,
  ApiResponse,
} from '../../delivery/dtos/firebase-product.dto';

export interface IProductRepository {
  getProducts(
    pagination?: PaginationQuery,
  ): Promise<
    Result<
      PaginatedApiResponse<ProductResponseDto>,
      ExternalServiceException | Error
    >
  >;
  getProductById(
    id: string,
  ): Promise<
    Result<
      ApiResponse<ProductResponseDto>,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
  createProduct(
    product: Product,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>>;
  updateStock(
    id: string,
    stock: number,
  ): Promise<
    Result<ApiResponse<ProductResponseDto>, ProductNotFoundException | Error>
  >;
  deleteProduct(
    id: string,
  ): Promise<Result<ApiResponse<void>, ProductNotFoundException | Error>>;
}
