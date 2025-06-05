import { Result } from 'src/application/core/types/result';
import {
  FirebaseProductDto,
  CreateFirebaseProductDto,
  PaginatedFirebaseResponse,
} from '../../../delivery/dtos/firebase-product.dto';

export interface IProductDataSource {
  findAll(
    pageSize?: number,
    startAfterDoc?: string,
  ): Promise<Result<PaginatedFirebaseResponse, Error>>;
  findById(id: string): Promise<Result<FirebaseProductDto | null, Error>>;
  create(
    productData: CreateFirebaseProductDto,
  ): Promise<Result<FirebaseProductDto, Error>>;
  update(
    id: string,
    productData: Partial<CreateFirebaseProductDto>,
  ): Promise<Result<FirebaseProductDto, Error>>;
  updateStock(
    id: string,
    stock: number,
  ): Promise<Result<FirebaseProductDto, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
  exists(id: string): Promise<Result<boolean, Error>>;
}
