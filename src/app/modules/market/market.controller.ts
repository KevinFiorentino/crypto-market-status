import { Controller, Get, Post, Query, Body, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDTO } from './market.dto';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';

@Controller('market')
export class MarketController {

  constructor(
    private readonly api: BitfinexApiService
  ) {}

  @Post('order')
  @HttpCode(HttpStatus.CREATED)
  async postOrderPrice(@Body() payload: CreateOrderDTO) {

    // Step 1: Validate pair
    const pairsAvailable = await this.api.getPairsList();

    let validatePair = null;
    if (pairsAvailable.data && pairsAvailable.data[0])
      validatePair = pairsAvailable.data[0].findIndex((p: string) => {
        return p == payload.pair;
      });

    if (!validatePair || validatePair == -1)
      throw new NotFoundException(`The pair ${payload.pair} has not been found.`);


    // Step 2: Get order price estimate
    const order = await this.api.postOrderPrice(payload.pair, payload.amount);

    // Step 3: Calculate buy or sell
    if (payload.type == 'buy') {

    } else if (payload.type == 'sell') {

    } else {
      throw new InternalServerErrorException(`Something went wrong.`);
    }


    console.log(order.data)



    return { statusCode: HttpStatus.CREATED, result: { data: order.data } };
  }

}
