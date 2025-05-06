import { Product } from '../entities/product.entity';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  updateStock(id: number, stock: number): Promise<Product>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}
