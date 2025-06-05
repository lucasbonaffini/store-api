import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateStockDto,
} from 'src/application/product/delivery/dtos/product.dto';
import { PaginationQuery } from '../../../delivery/dtos/firebase-product.dto';
import { IProductService } from '../../controllers/interfaces/product.service.interface';
import {
  ICreateProductUseCase,
  IGetProductsUseCase,
  IUpdateStockUseCase,
  IDeleteProductUseCase,
} from 'src/application/product/delivery/services/interfaces/product-use-case.interface';
import { ErrorMapperService } from 'src/application/product/data/mappers/error-maper.service';
import {
  PaginatedApiResponse,
  ApiResponse,
} from '../../../delivery/dtos/firebase-product.dto';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('ICreateProductUseCase')
    private readonly createProductUseCase: ICreateProductUseCase,
    @Inject('IGetProductsUseCase')
    private readonly getProductsUseCase: IGetProductsUseCase,
    @Inject('IUpdateStockUseCase')
    private readonly updateStockUseCase: IUpdateStockUseCase,
    @Inject('IDeleteProductUseCase')
    private readonly deleteProductUseCase: IDeleteProductUseCase,
    @Inject(ErrorMapperService)
    private readonly errorMapper: ErrorMapperService,
  ) {}

  async getProducts(
    pagination?: PaginationQuery,
  ): Promise<Result<PaginatedApiResponse<ProductResponseDto>, Error>> {
    const result = await this.getProductsUseCase.execute(pagination);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductFetchError(
        result.throwable,
      );
      const errorResponse: PaginatedApiResponse<ProductResponseDto> = {
        data: {
          items: [],
          pagination: {
            hasNextPage: false,
            nextCursor: null,
            currentPage: 'first',
            totalInPage: 0,
          },
        },
        error: {
          message: mappedError.message,
        },
      };
      return { type: 'success', value: errorResponse };
    }

    return result;
  }

  async getProductById(
    id: string,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>> {
    const result = await this.getProductsUseCase.executeById(id);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductFetchByIdError(
        result.throwable,
        id,
      );
      const errorResponse: ApiResponse<ProductResponseDto> = {
        data: null,
        error: {
          message: mappedError.message,
        },
      };
      return { type: 'success', value: errorResponse };
    }

    return result;
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>> {
    const result = await this.createProductUseCase.execute(createProductDto);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductCreateError(
        result.throwable,
      );
      const errorResponse: ApiResponse<ProductResponseDto> = {
        data: null,
        error: {
          message: mappedError.message,
        },
      };
      return { type: 'success', value: errorResponse };
    }

    return result;
  }

  async updateStock(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>> {
    const result = await this.updateStockUseCase.execute(id, updateStockDto);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapStockUpdateError(
        result.throwable,
        id,
      );
      const errorResponse: ApiResponse<ProductResponseDto> = {
        data: null,
        error: {
          message: mappedError.message,
        },
      };
      return { type: 'success', value: errorResponse };
    }

    return result;
  }

  async deleteProduct(id: string): Promise<Result<ApiResponse<void>, Error>> {
    const result = await this.deleteProductUseCase.execute(id);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductDeleteError(
        result.throwable,
        id,
      );
      const errorResponse: ApiResponse<void> = {
        data: null,
        error: {
          message: mappedError.message,
        },
      };
      return { type: 'success', value: errorResponse };
    }

    return result;
  }
}
