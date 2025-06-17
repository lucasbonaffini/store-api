import { Module } from '@nestjs/common';
import { ProductController } from './delivery/controllers/product.controller';
import { ProductService } from './delivery/services/impl/product.service';
import { ProductResponseMapper } from 'src/application/product/data/mappers/product-response.mapper';

import { CreateProductUseCase } from 'src/application/product/use-cases/impl/create-product.use-case';
import { DeleteProductUseCase } from 'src/application/product/use-cases/impl/delete-product.use-case';
import { GetProductsUseCase } from 'src/application/product/use-cases/impl/get-products.use-case';
import { UpdateStockUseCase } from 'src/application/product/use-cases/impl/update-stock.use-case';

import { PrismaProductDataSource } from './infrastructure/datasources/prisma/prisma-product.datasource';
import { PrismaModule } from './infrastructure/datasources/prisma/prisma.module';
import { FakeStoreModule } from './infrastructure/datasources/adapters/fakestore/fakestore.module';
import { CacheModule } from './infrastructure/datasources/cache/cache.module';

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
