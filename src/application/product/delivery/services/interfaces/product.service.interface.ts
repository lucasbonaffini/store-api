import {
  ProductResponseDto,
  CreateProductDto,
  UpdateStockDto,
} from 'src/application/dtos/product.dto';

export abstract class IProductService {
  abstract getProducts(): Promise<ProductResponseDto[]>;
  abstract getProductById(id: number): Promise<ProductResponseDto>;
  abstract createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto>;
  abstract updateStock(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<ProductResponseDto>;
  abstract deleteProduct(id: number): Promise<void>;
}
