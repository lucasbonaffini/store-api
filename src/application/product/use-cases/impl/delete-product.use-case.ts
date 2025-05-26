import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../../data/repositories/interfaces/product-repository.interface';
import {
  ProductNotFoundException,
  DatabaseException,
} from '../../domain/exceptions';
import { IDeleteProductUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
  ): Promise<Result<void, ProductNotFoundException | DatabaseException>> {
    return await this.productRepository.deleteProduct(id);
  }
}
