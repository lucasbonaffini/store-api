import { Result } from 'src/application/core/types/result';
import {
  FirebaseProductEntity,
  CreateFirebaseProductEntity,
  PaginatedFirebaseResponse,
} from '../../../infrastructure/entities/firebase-product.entity';

export interface IProductDataSource {
  findAll(
    pageSize?: number,
    cursor?: string,
  ): Promise<Result<PaginatedFirebaseResponse, Error>>;
  findById(id: string): Promise<Result<FirebaseProductEntity | null, Error>>;
  create(
    productData: CreateFirebaseProductEntity,
  ): Promise<Result<FirebaseProductEntity, Error>>;
  update(
    id: string,
    productData: Partial<CreateFirebaseProductEntity>,
  ): Promise<Result<FirebaseProductEntity, Error>>;
  updateStock(
    id: string,
    stock: number,
  ): Promise<Result<FirebaseProductEntity, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
  exists(id: string): Promise<Result<boolean, Error>>;
}
