import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../../delivery/dtos/product.dto';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginationMeta,
} from '../../delivery/dtos/firebase-product.dto';

@Injectable()
export class ProductResponseMapper {
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

  toApiResponse<T>(
    data: T | null,
    errorMessage: string | null = null,
  ): ApiResponse<T> {
    return {
      data,
      error: {
        message: errorMessage,
      },
    };
  }

  toPaginatedApiResponse<T>(
    items: T[],
    pagination: PaginationMeta,
    errorMessage: string | null = null,
  ): PaginatedApiResponse<T> {
    return {
      data: {
        items,
        pagination,
      },
      error: {
        message: errorMessage,
      },
    };
  }
}
