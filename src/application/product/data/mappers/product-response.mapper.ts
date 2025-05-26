import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from 'src/application/product/delivery/dtos/product.dto';
import { Product } from 'src/application/product/domain/entities/product.entity';

@Injectable()
export class ProductResponseMapper {
  toResponseDto(product: Product): ProductResponseDto {
    const productData = product.toJSON();

    return productData;
  }

  toResponseDtoList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponseDto(product));
  }
}
