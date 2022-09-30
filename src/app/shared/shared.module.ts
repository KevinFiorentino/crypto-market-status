import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { BitfinexApiService } from './services/bitfinex-api.service';

const SERVICES = [
  BitfinexApiService
];

@Module({
  imports: [
    HttpModule
  ],
  providers: SERVICES,
  exports: SERVICES
})
export class SharedModule {}
