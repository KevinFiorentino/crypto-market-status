import { NotFoundException, BadRequestException } from '@nestjs/common';
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

      const mockOrderPrice = Promise.resolve({ data: [19500, 2.5] });
      jest.spyOn(api, 'postPriceAVG').mockImplementation(() => mockOrderPrice);

      const response = await controller.postPriceAVG({
        pair: 'BTCUSD',
        type: 'buy',
        amount: 2.5,
      });

      const totalToPay = response.result.data.totalToPay;

      expect(48750).toBe(totalToPay);
    });


    it('Should return a cotization to sell', async () => {

      const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
      jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

      const mockOrderPrice = Promise.resolve({ data: [1300, 10] });
      jest.spyOn(api, 'postPriceAVG').mockImplementation(() => mockOrderPrice);

      const response = await controller.postPriceAVG({
        pair: 'ETHUSD',
        type: 'sell',
        amount: 10,
      });

      const totalToReceive = response.result.data.totalToReceive;

      expect(13000).toBe(totalToReceive);
    });


    it('Should return an error: pair doesn t found', async () => {
      try {
        const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
        jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

        const response = await controller.postPriceAVG({
          pair: 'BTCUSDDDDD',
          type: 'buy',
          amount: 10,
        });

      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });


    it('Should return a max order exceeds', async () => {
      try {
        const mockPairList = Promise.resolve({ data: [['BTCUSD', 'ETHUSD', 'XXXUSD']] });
        jest.spyOn(api, 'getPairsList').mockImplementation(() => mockPairList);

        const mockOrderPrice = Promise.resolve({ data: [19500, 1000] });
        jest.spyOn(api, 'postPriceAVG').mockImplementation(() => mockOrderPrice);

        const response = await controller.postPriceAVG({
          pair: 'BTCUSD',
          type: 'buy',
          amount: 1000,
        });

      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

  });

});
