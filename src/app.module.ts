import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './application/product/product.module';
import { CacheModule } from './application/product/infrastructure/datasources/cache/cache.module';
import { AuthModule } from './application/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule,
    ProductModule,
    AuthModule,
  ],
})
export class AppModule {}
