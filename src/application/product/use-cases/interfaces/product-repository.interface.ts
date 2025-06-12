import { Result } from 'src/application/core/types/result';
import { Product } from '../../domain/entities/product.entity';
import { PaginatedResponse } from '../../domain/entities/pagination.entity';
import { PaginationQuery } from '../../delivery/dtos/firebase-product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../delivery/exceptions';

export interface IProductRepository {
  getProducts(
    pagination?: PaginationQuery,
  ): Promise<
    Result<PaginatedResponse<Product>, ExternalServiceException | Error>
  >;
  getProductById(
    id: string,
  ): Promise<
    Result<
      Product | null,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
  createProduct(product: Product): Promise<Result<Product, Error>>;
  updateStock(
    id: string,
    stock: number,
  ): Promise<Result<Product, ProductNotFoundException | Error>>;
  deleteProduct(
    id: string,
  ): Promise<Result<void, ProductNotFoundException | Error>>;
}
