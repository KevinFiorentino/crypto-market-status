import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

import { MarketController } from './market.controller';
import { MarketGateway } from './market.gateway';

@Module({
  imports: [
    SharedModule,
  ],
  controllers: [
    MarketController,
  ],
  providers: [
    MarketGateway,
  ],
  exports: []
})
export class MarketModule {}
