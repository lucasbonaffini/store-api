import { Injectable, Inject } from '@nestjs/common';
import { UpdateStockDto } from '../../delivery/dtos/product.dto';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../delivery/exceptions';
import { IUpdateStockUseCase } from '../../delivery/services/interfaces/product-use-case.interface';
import { Result } from 'src/application/core/types/result';
import { Product } from '../../domain/entities/product.entity';
@Injectable()
export class UpdateStockUseCase implements IUpdateStockUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    updateStockDto: UpdateStockDto,
  ): Promise<Result<Product, ProductNotFoundException | Error>> {
    return await this.productRepository.updateStock(id, updateStockDto.stock);
  }
}
