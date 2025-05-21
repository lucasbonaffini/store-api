import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../../dtos/product.dto';

export abstract class ICreateProductUseCase {
  abstract execute(createProductDto: CreateProductDto): Promise<Product>;
}

export abstract class IGetProductsUseCase {
  abstract execute(): Promise<Product[]>;
}

export abstract class IGetProductByIdUseCase {
  abstract execute(id: number): Promise<Product>;
}

export abstract class IUpdateStockUseCase {
  abstract execute(id: number, stock: number): Promise<Product>;
}

export abstract class IDeleteProductUseCase {
  abstract execute(id: number): Promise<void>;
}
