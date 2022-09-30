import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable()
export class BitfinexApiService {

  constructor(
    private readonly httpService: HttpService
  ) {}

  postOrderPrice(pair: string, amount: number): Promise<any> {
    return firstValueFrom(
      this.httpService.post(`${process.env.BITFINEX_API}calc/trade/avg?symbol=t${pair}&amount=${amount}`)
    );
  }

  getPairsList(): Promise<any> {
    return firstValueFrom(
      this.httpService.get(`${process.env.BITFINEX_API}conf/pub:list:pair:exchange`)
    );
  }

  getOrderBookInfo(pair: string): Promise<any> {
    return firstValueFrom(
      this.httpService.get(`${process.env.BITFINEX_API}book/t${pair}/P0?len=25`)
    );
  }

}
