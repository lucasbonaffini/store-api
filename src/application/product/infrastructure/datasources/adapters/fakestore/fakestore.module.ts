import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FakeStoreDataSource } from './fakestore.datasource';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [FakeStoreDataSource],
  exports: [FakeStoreDataSource],
})
export class FakeStoreModule {}
