import { Controller, Post, Body, HttpCode, HttpStatus, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDTO } from './market.dto';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';

@ApiTags('Market')
@Controller('market')
export class MarketController {

  // Limit operation (in USD)
  // We should persist this property dynamically in a BBDD
  private limit = 100_000;

  constructor(
    private readonly api: BitfinexApiService
  ) {}

  @Post('order')
  @ApiOperation({ summary: 'Get effective price of an order' })
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


    // Step 2: Calculate effective price
    let currentPairPrice = null;
    let totalPrice = null;
    let response = null;

    if (payload.type == 'buy') {
      // Get price for Buy
      const order = await this.api.postPriceAVG(payload.pair, payload.amount);

      currentPairPrice = order.data[0];
      totalPrice = currentPairPrice * payload.amount;

      if (totalPrice > this.limit) {
        const maxAvailable = this.limit / currentPairPrice;
        throw new BadRequestException(`The order exceeds the maximum amount available for a trade. Max available to BUY: ${maxAvailable} ${payload.pair}`);
      }

      response = {
        pair: payload.pair,
        typeOperation: payload.type,
        amount: payload.amount,
        currentPairPrice,
        totalToPay: totalPrice,
        expirationTime: '5s'
      }

    } else if (payload.type == 'sell') {
      // Get price for Sell
      const order = await this.api.postPriceAVG(payload.pair, payload.amount);

      currentPairPrice = order.data[0];
      totalPrice = currentPairPrice * payload.amount;

      if (totalPrice > this.limit) {
        const maxAvailable = this.limit / currentPairPrice;
        throw new BadRequestException(`The order exceeds the maximum amount available for a trade. Max available to SELL: ${maxAvailable} ${payload.pair}`);
      }

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
