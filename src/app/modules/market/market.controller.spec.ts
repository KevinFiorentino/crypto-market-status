import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { MarketController } from '@modules/market/market.controller';
import { BitfinexApiService } from '@shared/services/bitfinex-api.service';

describe('MarketController', () => {

  let controller: MarketController;
  let api: BitfinexApiService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [MarketController],
      providers: [BitfinexApiService],
    }).compile();

    api = moduleRef.get<BitfinexApiService>(BitfinexApiService);
    controller = moduleRef.get<MarketController>(MarketController);
  });

  describe('Get Effective Price', () => {

    it('Should return a cotization to buy', async () => {

      const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
      jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

      const mockOrderPrice = Promise.resolve({ data: [19500, 10] });
      jest.spyOn(api, 'postOrderPrice').mockImplementation(() => mockOrderPrice);

      const response = await controller.postOrderPrice({
        pair: 'BTCUSD',
        type: 'buy',
        amount: 10,
      });

      const totalPrice = response.result.data.totalPrice;

      expect(195000).toBe(totalPrice);
    });


    it('Should return a cotization to sell', async () => {

      const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
      jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

      const mockOrderPrice = Promise.resolve({ data: [1300, 10] });
      jest.spyOn(api, 'postOrderPrice').mockImplementation(() => mockOrderPrice);

      const response = await controller.postOrderPrice({
        pair: 'ETHUSD',
        type: 'sell',
        amount: 10,
      });

      const totalPrice = response.result.data.totalPrice;

      expect(-13000).toBe(totalPrice);
    });


    it('Should return an error: pair doesn t found', async () => {
      try {
        const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
        jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

        const response = await controller.postOrderPrice({
          pair: 'BTCUSDDDDD',
          type: 'buy',
          amount: 10,
        });

      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

  });

});
