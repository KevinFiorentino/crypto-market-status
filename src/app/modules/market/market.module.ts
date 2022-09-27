import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { MarketController } from './market.controller';

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    MarketController
  ],
  providers: [],
  exports: []
})
export class MarketModule {}
