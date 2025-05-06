import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../../application/services/product.service';
import { PrismaProductRepository } from '../repositories/prisma-product.repository';
import { PrismaModule } from '../database/prisma/prisma.module';
import { FakeStoreModule } from '../adapters/fakestore/fakestore.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, FakeStoreModule, CacheModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
