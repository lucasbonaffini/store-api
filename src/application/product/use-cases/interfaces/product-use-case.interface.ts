import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from '../../delivery/dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
  DatabaseException,
  InvalidProductDataException,
} from '../../domain/exceptions';
import { Result } from '../../../types/result';

export interface IGetProductsUseCase {
  execute(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | DatabaseException>
  >;
}

export interface IGetProductByIdUseCase {
  execute(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | DatabaseException
    >
  >;
}

export interface ICreateProductUseCase {
  execute(
    createProductDto: CreateProductDto,
  ): Promise<
    Result<ProductResponseDto, InvalidProductDataException | DatabaseException>
  >;
}

export interface IUpdateStockUseCase {
  execute(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<
    Result<ProductResponseDto, ProductNotFoundException | DatabaseException>
  >;
}

export interface IDeleteProductUseCase {
  execute(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | DatabaseException>>;
}
