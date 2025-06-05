import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from '../../../delivery/dtos/product.dto';
import { PaginationQuery } from '../../dtos/firebase-product.dto';
import {
  PaginatedApiResponse,
  ApiResponse,
} from '../../../delivery/dtos/firebase-product.dto';
import { Result } from 'src/application/core/types/result';

export interface IProductService {
  getProducts(
    pagination?: PaginationQuery,
  ): Promise<Result<PaginatedApiResponse<ProductResponseDto>, Error>>;
  getProductById(
    id: string,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>>;
  createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>>;
  updateStock(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>>;
  deleteProduct(id: string): Promise<Result<ApiResponse<void>, Error>>;
  getProductsByCategory?(
    category: string,
    pagination?: PaginationQuery,
  ): Promise<Result<PaginatedApiResponse<ProductResponseDto>, Error>>;
}
