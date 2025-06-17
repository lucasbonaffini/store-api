import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  UpdateStockDto,
} from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../domain/exceptions';
import { IUpdateStockUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';

@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<ProductResponseDto, ProductNotFoundException | Error>> {
    return await this.productRepository.updateStock(id, updateStockDto.stock);
  }
}
