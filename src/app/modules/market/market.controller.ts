import { Controller, Post, Body, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDTO } from './market.dto';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';

@ApiTags('Market')
@Controller('market')
export class MarketController {

  constructor(
    private readonly api: BitfinexApiService
  ) {}

  @Post('order')
  @ApiOperation({ summary: 'Get order - effective price' })
  @HttpCode(HttpStatus.CREATED)
  async postPriceAVG(@Body() payload: CreateOrderDTO) {

    // Step 1: Validate pair
    const pairsAvailable = await this.api.getPairsList();

    let validatePair = null;
    if (pairsAvailable.data && pairsAvailable.data[0])
      validatePair = pairsAvailable.data[0].findIndex((p: string) => {
        return p == payload.pair;
      });

    if (validatePair == null || validatePair == -1)
      throw new NotFoundException(`The pair ${payload.pair} has not been found.`);


    // Step 2: Calculate order
    let currentPairPrice = null;
    let totalPrice = null;
    let response = null;

    if (payload.type == 'buy') {
      // Get price estimate for Buy
      const order = await this.api.postPriceAVG(payload.pair, payload.amount);

      currentPairPrice = order.data[0];
      totalPrice = currentPairPrice * payload.amount;

      response = {
        pair: payload.pair,
        typeOperation: payload.type,
        amount: payload.amount,
        currentPairPrice,
        totalToPay: totalPrice,
        expirationTime: '5s'
      }

    } else if (payload.type == 'sell') {
      // Get price estimate for Sell
      const order = await this.api.postPriceAVG(payload.pair, payload.amount);

      currentPairPrice = order.data[0];
      totalPrice = currentPairPrice * payload.amount;

      response = {
        pair: payload.pair,
        typeOperation: payload.type,
        amount: payload.amount,
        currentPairPrice,
        totalToReceive: totalPrice,
        expirationTime: '5s'
      }

    } else {
      throw new InternalServerErrorException(`Something went wrong.`);
    }

    return {
      statusCode: HttpStatus.CREATED,
      result: { data: response }
    }
  }

}
