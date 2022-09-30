import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable()
export class BitfinexApiService {

  constructor(
    private readonly httpService: HttpService
  ) {}

  getPairsList(): Promise<any> {
    return firstValueFrom(
      this.httpService.get(`https://api-pub.bitfinex.com/v2/conf/pub:list:pair:exchange`)
    );
  }

  getOrderBookInfo(pair: string): Promise<any> {
    return firstValueFrom(
      this.httpService.get(`https://api-pub.bitfinex.com/v2/book/t${pair}/P0?len=25`)
    );
  }

}
