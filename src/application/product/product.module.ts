import { Module } from '@nestjs/common';
import { ProductController } from './delivery/controllers/product.controller';
import { ProductService } from './delivery/services/impl/product.service';
import { ProductResponseMapper } from 'src/application/product/data/mappers/product-response.mapper';

import { CreateProductUseCase } from 'src/application/product/use-cases/impl/create-product.use-case';
import { DeleteProductUseCase } from 'src/application/product/use-cases/impl/delete-product.use-case';
import { GetProductsUseCase } from 'src/application/product/use-cases/impl/get-products.use-case';
import { UpdateStockUseCase } from 'src/application/product/use-cases/impl/update-stock.use-case';

import { ErrorMapperService } from 'src/application/product/data/mappers/error-maper.service';
import { FirebaseErrorMapper } from 'src/application/product/data/mappers/firebase-error.mapper';
import { FirebaseResponseMapper } from 'src/application/product/data/mappers/firebase-response.mapper';
import { FirebaseToEntityMapper } from 'src/application/product/data/mappers/firebase-to-entity.mapper';
import { FakeStoreToEntityMapper } from 'src/application/product/infrastructure/mappers/fakestore-to-entity.mapper';

import { ProductRepository } from 'src/application/product/data/repositories/product.repository';
import { FirebaseProductDataSource } from 'src/application/product/infrastructure/datasources/firebase/product.firestore.datasource';

import { FakeStoreModule } from './infrastructure/datasources/adapters/fakestore/fakestore.module';
import { CacheModule } from './infrastructure/datasources/cache/cache.module';

@Module({
  imports: [FakeStoreModule, CacheModule],
  controllers: [ProductController],
  providers: [
    ProductResponseMapper,
    ErrorMapperService,
    FirebaseErrorMapper,
    FirebaseResponseMapper,
    FirebaseToEntityMapper,
    FakeStoreToEntityMapper,
    FirebaseProductDataSource,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IProductService',
      useClass: ProductService,
    },

    {
      provide: 'ICreateProductUseCase',
      useClass: CreateProductUseCase,
    },
    {
      provide: 'IDeleteProductUseCase',
      useClass: DeleteProductUseCase,
    },
    {
      provide: 'IGetProductsUseCase',
      useClass: GetProductsUseCase,
    },
    {
      provide: 'IUpdateStockUseCase',
      useClass: UpdateStockUseCase,
    },
  ],
  exports: ['IProductService'],
})
export class ProductModule {}
