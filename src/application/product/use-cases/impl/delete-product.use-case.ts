import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../delivery/exceptions';
import { IDeleteProductUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
  ): Promise<Result<void, ProductNotFoundException | Error>> {
    return await this.productRepository.deleteProduct(id);
  }
}
