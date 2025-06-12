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
import { ProductResponseMapper } from 'src/application/product/data/mappers/product-response.mapper';
import {
  PaginatedApiResponse,
  ApiResponse,
  PaginationMeta,
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
    @Inject(ProductResponseMapper)
    private readonly responseMapper: ProductResponseMapper,
  ) {}

  async getProducts(
    pagination?: PaginationQuery,
  ): Promise<Result<PaginatedApiResponse<ProductResponseDto>, Error>> {
    const result = await this.getProductsUseCase.execute(pagination);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductFetchError(
        result.throwable,
      );
      return { type: 'error', throwable: mappedError };
    }

    const productsData = result.value;
    const responseDtos = this.responseMapper.toResponseDtoList(
      productsData.data,
    );

    const paginationMeta: PaginationMeta = {
      ...productsData.pagination,
      currentPage: productsData.pagination.nextCursor
        ? `cursor_${productsData.pagination.nextCursor}`
        : 'first',
    };

    const response = this.responseMapper.toPaginatedApiResponse(
      responseDtos,
      paginationMeta,
    );

    return { type: 'success', value: response };
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
      return { type: 'error', throwable: mappedError };
    }

    const product = result.value;

    if (!product) {
      const notFoundError = new Error(`Product with id ${id} not found`);
      return { type: 'error', throwable: notFoundError };
    }

    const responseDto = this.responseMapper.toResponseDto(product);
    const response = this.responseMapper.toApiResponse(responseDto);

    return { type: 'success', value: response };
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Result<ApiResponse<ProductResponseDto>, Error>> {
    const result = await this.createProductUseCase.execute(createProductDto);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductCreateError(
        result.throwable,
      );
      return { type: 'error', throwable: mappedError };
    }

    const product = result.value;
    const responseDto = this.responseMapper.toResponseDto(product);
    const response = this.responseMapper.toApiResponse(responseDto);

    return { type: 'success', value: response };
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
      return { type: 'error', throwable: mappedError };
    }

    const product = result.value;
    const responseDto = this.responseMapper.toResponseDto(product);
    const response = this.responseMapper.toApiResponse(responseDto);

    return { type: 'success', value: response };
  }

  async deleteProduct(id: string): Promise<Result<ApiResponse<void>, Error>> {
    const result = await this.deleteProductUseCase.execute(id);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductDeleteError(
        result.throwable,
        id,
      );
      return { type: 'error', throwable: mappedError };
    }

    const response = this.responseMapper.toApiResponse<void>(undefined);
    return { type: 'success', value: response };
  }
}
