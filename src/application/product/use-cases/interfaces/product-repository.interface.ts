import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../domain/exceptions';
import { Result } from '../../../core/types/result';

export interface IProductRepository {
  getProducts(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | Error>
  >;
  getProductById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
  createProduct(product: Product): Promise<Result<ProductResponseDto, Error>>;
  updateStock(
    id: number,
    stock: number,
  ): Promise<Result<ProductResponseDto, ProductNotFoundException | Error>>;
  deleteProduct(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | Error>>;
}
