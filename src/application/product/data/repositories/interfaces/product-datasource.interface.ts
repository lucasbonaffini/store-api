import { Product } from '../../../domain/entities/product.entity';
import { Result } from 'src/application/core/types/result';

export interface IProductDataSource {
  findAll(): Promise<Result<Product[], Error>>;
  findById(id: number): Promise<Result<Product | null, Error>>;
  create(product: Product): Promise<Result<Product, Error>>;
  update(product: Product): Promise<Result<Product, Error>>;
  updateStock(id: number, stock: number): Promise<Result<Product, Error>>;
  delete(id: number): Promise<Result<void, Error>>;
  exists(id: number): Promise<Result<boolean, Error>>;
}
