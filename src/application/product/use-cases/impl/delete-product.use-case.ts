import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../delivery/exceptions';
import { IDeleteProductUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
import { ApiResponse } from '../../delivery/dtos/firebase-product.dto';
@Injectable()
export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
  ): Promise<Result<ApiResponse<void>, ProductNotFoundException | Error>> {
    return await this.productRepository.deleteProduct(id);
  }
}
