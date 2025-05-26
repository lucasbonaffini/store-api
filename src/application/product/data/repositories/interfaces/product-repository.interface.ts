import { Product } from '../../../domain/entities/product.entity';
import { ProductResponseDto } from '../../../delivery/dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
  DatabaseException,
} from '../../../domain/exceptions';
import { Result } from '../../../../types/result';

export interface IProductRepository {
  getProducts(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | DatabaseException>
  >;
  getProductById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | DatabaseException
    >
  >;
  createProduct(
    product: Product,
  ): Promise<Result<ProductResponseDto, DatabaseException>>;
  updateStock(
    id: number,
    stock: number,
  ): Promise<
    Result<ProductResponseDto, ProductNotFoundException | DatabaseException>
  >;
  deleteProduct(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | DatabaseException>>;
}
