import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateStockDto,
} from 'src/application/dtos/product.dto';
import { IProductService } from '../interfaces/product.service.interface';
import {
  ICreateProductUseCase,
  IGetProductsUseCase,
  IGetProductByIdUseCase,
  IUpdateStockUseCase,
  IDeleteProductUseCase,
} from 'src/application/product/use-cases/interfaces/product-use-case.interface';
import { ProductResponseMapper } from '../../../data/mappers/product-response.mapper';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('ICreateProductUseCase')
    private readonly createProductUseCase: ICreateProductUseCase,
    @Inject('IGetProductsUseCase')
    private readonly getProductsUseCase: IGetProductsUseCase,
    @Inject('IGetProductByIdUseCase')
    private readonly getProductByIdUseCase: IGetProductByIdUseCase,
    @Inject('IUpdateStockUseCase')
    private readonly updateStockUseCase: IUpdateStockUseCase,
    @Inject('IDeleteProductUseCase')
    private readonly deleteProductUseCase: IDeleteProductUseCase,
    @Inject(ProductResponseMapper)
    private readonly productResponseMapper: ProductResponseMapper,
  ) {}

  async getProducts(): Promise<ProductResponseDto[]> {
    const result = await this.getProductsUseCase.execute();
    if (result.type === 'error') {
      throw result.throwable;
    }
    return this.productResponseMapper.toResponseDtoList(result.value);
  }

  async getProductById(id: number): Promise<ProductResponseDto> {
    const result = await this.getProductByIdUseCase.execute(id);
    if (result.type === 'error') {
      throw result.throwable;
    }
    return this.productResponseMapper.toResponseDto(result.value);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const result = await this.createProductUseCase.execute(createProductDto);
    if (result.type === 'error') {
      throw result.throwable;
    }
    return this.productResponseMapper.toResponseDto(result.value);
  }

  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<ProductResponseDto> {
    const result = await this.updateStockUseCase.execute(
      id,
      updateStockDto.stock,
    );
    if (result.type === 'error') {
      throw result.throwable;
    }
    return this.productResponseMapper.toResponseDto(result.value);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.deleteProductUseCase.execute(id);
    if (result.type === 'error') {
      throw result.throwable;
    }
    return result.value;
  }
}
