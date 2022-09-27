import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

import { OrderBookController } from './order-book.controller';
import { OrderBookGateway } from './order-book.gateway';

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    OrderBookController,
  ],
  providers: [
    OrderBookGateway,
  ],
  exports: []
})
export class OrderBookModule {}
