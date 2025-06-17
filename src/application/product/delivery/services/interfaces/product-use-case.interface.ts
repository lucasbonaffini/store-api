import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from '../../dtos/product.dto';
import {
  ProductNotFoundException,
  ExternalServiceException,
} from '../../../domain/exceptions';
import { Result } from '../../../../core/types/result';

export interface IGetProductsUseCase {
  execute(): Promise<
    Result<ProductResponseDto[], ExternalServiceException | Error>
  >;
  executeById(
    id: number,
  ): Promise<
    Result<
      ProductResponseDto,
      ProductNotFoundException | ExternalServiceException | Error
    >
  >;
}

export interface ICreateProductUseCase {
  execute(
    createProductDto: CreateProductDto,
  ): Promise<Result<ProductResponseDto, Error>>;
}

export interface IUpdateStockUseCase {
  execute(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<ProductResponseDto, ProductNotFoundException | Error>>;
}

export interface IDeleteProductUseCase {
  execute(id: number): Promise<Result<void, ProductNotFoundException | Error>>;
}
