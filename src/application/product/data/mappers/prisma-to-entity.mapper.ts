import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  PrismaProductDto,
  CreatePrismaProductDto,
} from '../../delivery/dtos/prisma-product.dto';
import { CreateProductDto } from '../../delivery/dtos/product.dto';

@Injectable()
export class PrismaToEntityMapper {
  toDomainEntity(prismaData: PrismaProductDto): Product {
    return new Product(
      prismaData.id,
      prismaData.title,
      prismaData.price,
      prismaData.description,
      prismaData.category,
      prismaData.image,
      prismaData.stock,
      prismaData.createdAt,
      prismaData.updatedAt,
    );
  }

  toDomainEntityList(prismaDataList: PrismaProductDto[]): Product[] {
    return prismaDataList.map((data) => this.toDomainEntity(data));
  }

  toCreatePrismaDto(
    createProductDto: CreateProductDto,
  ): CreatePrismaProductDto {
    return {
      title: createProductDto.title,
      price: createProductDto.price,
      description: createProductDto.description,
      category: createProductDto.category,
      image: createProductDto.image,
      stock: createProductDto.stock || 0,
    };
  }

  fromDomainEntityToCreateDto(product: Product): CreatePrismaProductDto {
    return {
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock,
    };
  }
}
