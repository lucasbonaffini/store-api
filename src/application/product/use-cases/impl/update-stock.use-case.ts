import { Injectable, Inject } from '@nestjs/common';
import {
  ProductResponseDto,
  UpdateStockDto,
} from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../../data/repositories/interfaces/product-repository.interface';
import {
  ProductNotFoundException,
  DatabaseException,
} from '../../domain/exceptions';
import { IUpdateStockUseCase } from '../interfaces/product-use-case.interface';
import { Result } from 'src/application/types/result';

@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
    updateStockDto: UpdateStockDto,
  ): Promise<
    Result<ProductResponseDto, ProductNotFoundException | DatabaseException>
  > {
    return await this.productRepository.updateStock(id, updateStockDto.stock);
  }
}
