import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateStockDto,
} from 'src/application/product/delivery/dtos/product.dto';
import { IProductService } from '../../controllers/interfaces/product.service.interface';
import {
  ICreateProductUseCase,
  IGetProductsUseCase,
  IUpdateStockUseCase,
  IDeleteProductUseCase,
} from 'src/application/product/delivery/services/interfaces/product-use-case.interface';
import { ErrorMapperService } from 'src/application/product/data/mappers/error-maper.service';

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

  async getProducts(): Promise<ProductResponseDto[]> {
    const result = await this.getProductsUseCase.execute();

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductFetchError(
        result.throwable,
      );
      throw mappedError;
    }

    return result.value;
  }

  async getProductById(id: number): Promise<ProductResponseDto> {
    const result = await this.getProductsUseCase.executeById(id);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductFetchByIdError(
        result.throwable,
        id,
      );
      throw mappedError;
    }

    return result.value;
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const result = await this.createProductUseCase.execute(createProductDto);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductCreateError(
        result.throwable,
      );
      throw mappedError;
    }

    return result.value;
  }

  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<ProductResponseDto> {
    const result = await this.updateStockUseCase.execute(id, updateStockDto);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapStockUpdateError(
        result.throwable,
        id,
      );
      throw mappedError;
    }

    return result.value;
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.deleteProductUseCase.execute(id);

    if (result.type === 'error') {
      const mappedError = this.errorMapper.mapProductDeleteError(
        result.throwable,
        id,
      );
      throw mappedError;
    }

    return result.value;
  }
}
