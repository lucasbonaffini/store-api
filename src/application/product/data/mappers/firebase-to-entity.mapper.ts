import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../delivery/dtos/product.dto';
import {
  FirebaseProductEntity,
  CreateFirebaseProductEntity,
} from '../../infrastructure/entities/firebase-product.entity';

@Injectable()
export class FirebaseToEntityMapper {
  toDomainEntity(firebaseData: FirebaseProductEntity): Product {
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

  toDomainEntityList(firebaseDataList: FirebaseProductEntity[]): Product[] {
    return firebaseDataList.map((data) => this.toDomainEntity(data));
  }

  toCreateFirebaseEntity(
    createProductDto: CreateProductDto,
  ): CreateFirebaseProductEntity {
    return {
      title: createProductDto.title,
      price: createProductDto.price,
      description: createProductDto.description,
      category: createProductDto.category,
      image: createProductDto.image,
      stock: createProductDto.stock ?? 0,
    };
  }

  fromDomainEntityToCreateEntity(
    product: Product,
  ): CreateFirebaseProductEntity {
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
