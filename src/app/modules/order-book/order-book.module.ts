import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { OrderBookController } from './order-book.controller';

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    OrderBookController
  ],
  providers: [],
  exports: []
})
export class OrderBookModule {}
