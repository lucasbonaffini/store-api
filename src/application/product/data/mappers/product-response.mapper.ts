import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import { PrismaErrorMapper } from './prisma-error.mapper';
@Injectable()
export class ProductResponseMapper {
  constructor(
    @Inject(PrismaErrorMapper)
    private readonly prismaErrorMapper: PrismaErrorMapper,
  ) {}

  toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  toResponseDtoList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponseDto(product));
  }
}
