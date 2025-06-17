import { Result } from 'src/application/core/types/result';
import {
  PrismaProductDto,
  CreatePrismaProductDto,
} from 'src/application/product/delivery/dtos/prisma-product.dto';

export interface IProductDataSource {
  findAll(): Promise<Result<PrismaProductDto[], Error>>;
  findById(id: number): Promise<Result<PrismaProductDto | null, Error>>;
  create(
    productData: CreatePrismaProductDto,
  ): Promise<Result<PrismaProductDto, Error>>;
  update(
    id: number,
    productData: Partial<CreatePrismaProductDto>,
  ): Promise<Result<PrismaProductDto, Error>>;
  updateStock(
    id: number,
    stock: number,
  ): Promise<Result<PrismaProductDto, Error>>;
  delete(id: number): Promise<Result<void, Error>>;
  exists(id: number): Promise<Result<boolean, Error>>;
}
