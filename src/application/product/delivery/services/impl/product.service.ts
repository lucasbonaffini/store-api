import { Injectable } from '@nestjs/common';
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
    private readonly createProductUseCase: ICreateProductUseCase,
    private readonly getProductsUseCase: IGetProductsUseCase,
    private readonly getProductByIdUseCase: IGetProductByIdUseCase,
    private readonly updateStockUseCase: IUpdateStockUseCase,
    private readonly deleteProductUseCase: IDeleteProductUseCase,
    private readonly productResponseMapper: ProductResponseMapper,
  ) {}

  async getProducts(): Promise<ProductResponseDto[]> {
    const products = await this.getProductsUseCase.execute();
    return this.productResponseMapper.toResponseDtoList(products);
  }

  async getProductById(id: number): Promise<ProductResponseDto> {
    const product = await this.getProductByIdUseCase.execute(id);
    return this.productResponseMapper.toResponseDto(product);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(createProductDto);
    return this.productResponseMapper.toResponseDto(product);
  }

  async updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateStockUseCase.execute(
      id,
      updateStockDto.stock,
    );
    return this.productResponseMapper.toResponseDto(product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
