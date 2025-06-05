import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  FirebaseProductDto,
  CreateFirebaseProductDto,
} from '../../delivery/dtos/firebase-product.dto';
import { CreateProductDto } from '../../delivery/dtos/product.dto';

@Injectable()
export class FirebaseToEntityMapper {
  toDomainEntity(firebaseData: FirebaseProductDto): Product {
    return new Product(
      firebaseData.id,
      firebaseData.title,
      firebaseData.price,
      firebaseData.description,
      firebaseData.category,
      firebaseData.image,
      firebaseData.stock,
      firebaseData.createdAt,
      firebaseData.updatedAt,
    );
  }

  toDomainEntityList(firebaseDataList: FirebaseProductDto[]): Product[] {
    return firebaseDataList.map((data) => this.toDomainEntity(data));
  }

  toCreateFirebaseDto(
    createProductDto: CreateProductDto,
  ): CreateFirebaseProductDto {
    return {
      title: createProductDto.title,
      price: createProductDto.price,
      description: createProductDto.description,
      category: createProductDto.category,
      image: createProductDto.image,
      stock: createProductDto.stock ?? 0,
    };
  }

  fromDomainEntityToCreateDto(product: Product): CreateFirebaseProductDto {
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
