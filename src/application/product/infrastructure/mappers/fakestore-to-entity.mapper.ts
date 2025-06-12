import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { FakeStoreProduct } from '../datasources/adapters/fakestore/fakestore.types';

@Injectable()
export class FakeStoreToEntityMapper {
  toDomainEntity(
    fakeStoreProduct: FakeStoreProduct,
    stock: number = Math.floor(Math.random() * 100) + 1,
  ): Product {
    const now = new Date();
    return new Product(
      fakeStoreProduct.id?.toString() || '',
      fakeStoreProduct.title,
      fakeStoreProduct.price,
      fakeStoreProduct.description,
      fakeStoreProduct.category,
      fakeStoreProduct.image,
      stock,
      now,
      now,
    );
  }

  toDomainEntityList(fakeStoreProducts: FakeStoreProduct[]): Product[] {
    return fakeStoreProducts.map((product) => this.toDomainEntity(product));
  }
}
