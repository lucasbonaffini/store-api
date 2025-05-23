import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FakeStoreService } from './fakestore.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [FakeStoreService],
  exports: [FakeStoreService],
})
export class FakeStoreModule {}
