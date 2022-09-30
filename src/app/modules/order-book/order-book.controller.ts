import { Controller, Get, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetOrderBookDTO } from './order-book.dto';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';
import { OrderBook } from '@shared/interfaces/order-book.interface';

@ApiTags('OrderBook')
@Controller('order-book')
export class OrderBookController {

  constructor(
    private readonly api: BitfinexApiService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get better prices for bid/ask of a pair' })
  @HttpCode(HttpStatus.CREATED)
  async postOrderPrice(@Body() payload: GetOrderBookDTO) {

    // Step 1: Validate pair
    const pairsAvailable = await this.api.getPairsList();

    let validatePair = null;
    if (pairsAvailable.data && pairsAvailable.data[0])
      validatePair = pairsAvailable.data[0].findIndex((p: string) => {
        return p == payload.pair;
      });

    if (validatePair == null || validatePair == -1)
      throw new NotFoundException(`The pair ${payload.pair} has not been found.`);


    // Step 2: Get Order Book Info
    const ob = await this.api.getOrderBookInfo(payload.pair);

    const bid: OrderBook[] = [];
    const ask: OrderBook[] = [];

    ob.data.forEach(e => {
      if (e[2] > 0) {
        bid.push({
          price: e[0],
          count: e[1],
          amount: e[2]
        });
      } else {
        ask.push({
          price: e[0],
          count: e[1],
          amount: e[2]
        });
      }
    });

    return {
      statusCode: HttpStatus.OK,
      result: { data: { bid, ask } }
    }
  }

}
