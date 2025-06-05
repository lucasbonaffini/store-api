import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  UpdateStockDto,
} from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../delivery/exceptions';
import { IUpdateStockUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
import { ApiResponse } from '../../delivery/dtos/firebase-product.dto';
@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<
    Result<ApiResponse<ProductResponseDto>, ProductNotFoundException | Error>
  > {
    return await this.productRepository.updateStock(id, updateStockDto.stock);
  }
}
