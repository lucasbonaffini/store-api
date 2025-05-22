import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../../dtos/product.dto';
import { Result } from 'src/application/types/result';

export abstract class ICreateProductUseCase {
  abstract execute(
    createProductDto: CreateProductDto,
  ): Promise<Result<Product, Error>>;
}

export abstract class IGetProductsUseCase {
  abstract execute(): Promise<Result<Product[], Error>>;
}

export abstract class IGetProductByIdUseCase {
  abstract execute(id: number): Promise<Result<Product, Error>>;
}

export abstract class IUpdateStockUseCase {
  abstract execute(id: number, stock: number): Promise<Result<Product, Error>>;
}

export abstract class IDeleteProductUseCase {
  abstract execute(id: number): Promise<Result<void, Error>>;
}
