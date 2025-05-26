import { Module } from '@nestjs/common';
import { ProductController } from '../../application/product/delivery/controllers/product.controller';
import { ProductService } from '../../application/product/delivery/services/impl/product.service';
import { ProductResponseMapper } from 'src/application/product/data/mappers/product-response.mapper';

import { CreateProductUseCase } from 'src/application/product/use-cases/impl/create-product.use-case';
import { DeleteProductUseCase } from 'src/application/product/use-cases/impl/delete-product.use-case';
import { GetProductByIdUseCase } from 'src/application/product/use-cases/impl/get-product-by-id.use-case';
import { GetProductsUseCase } from 'src/application/product/use-cases/impl/get-products.use-case';
import { UpdateStockUseCase } from 'src/application/product/use-cases/impl/update-stock.use-case';

import { PrismaProductDataSource } from '../datasource/prisma-product.datasource';
import { PrismaModule } from '../database/prisma/prisma.module';
import { FakeStoreModule } from '../adapters/fakestore/fakestore.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, FakeStoreModule, CacheModule],
  controllers: [ProductController],
  providers: [
    ProductResponseMapper,
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
      provide: 'IGetProductByIdUseCase',
      useClass: GetProductByIdUseCase,
    },
    {
      provide: 'IGetProductsUseCase',
      useClass: GetProductsUseCase,
    },
    {
      provide: 'IUpdateStockUseCase',
      useClass: UpdateStockUseCase,
    },

    {
      provide: 'ProductRepository',
      useClass: PrismaProductDataSource,
    },
  ],
  exports: ['IProductService'],
})
export class ProductModule {}
