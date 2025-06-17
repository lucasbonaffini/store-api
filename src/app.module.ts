import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './application/product/product.module';
import { CacheModule } from './application/product/infrastructure/datasources/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule,
    ProductModule,
  ],
})
export class AppModule {}
