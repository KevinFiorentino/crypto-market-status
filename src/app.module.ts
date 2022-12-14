import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { ErrorsInterceptor } from '@shared/interceptors/errors.interceptor';

import * as cors from 'cors';
import * as helmet from 'helmet';
import morgan from './configs/morgan.config';

import { SharedModule } from '@shared/shared.module';

import { MarketModule } from '@modules/market/market.module';
import { OrderBookModule } from '@modules/order-book/order-book.module';

@Module({
  imports: [
    /* Nest/Config Modules */
    ConfigModule.forRoot(),

    /* Custom Modules */
    SharedModule,
    MarketModule,
    OrderBookModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors({ origin: '*' }), helmet(), morgan)
      .forRoutes('*');
  }
}
