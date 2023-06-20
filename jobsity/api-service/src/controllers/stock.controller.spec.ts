import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { APP_CONSTANTS } from '../app.constants';
import { AuthModule } from '../modules/auth/auth.module';
import { DatabaseModule } from '../modules/database/database.module';
import { CrossApiModule } from '../modules/cross-api/cross-api.module';
import { StockController } from './stock.controller';
import { StockModel } from '../modules/cross-api/stock/stock.model';

describe('AppController', () => {
  let stockController: StockController;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      imports: [
        AuthModule.forRoot(APP_CONSTANTS.jwtSecret, APP_CONSTANTS.jwtExpiresIn, ''),
        DatabaseModule.forRoot(''),
        CrossApiModule
      ]
    }).compile();

    stockController = app.get<StockController>(StockController);
    httpService = app.get<HttpService>(HttpService);
  });

  describe('app.controler', () => {

    it('should return 5 rows of history', async () => {
      const responseMock: StockModel[] = [{
        "symbol": "A.US",
        "date": "2022-04-09T01:02:09.000Z",
        "open": "135.71",
        "high": "136.9855",
        "low": "134.65",
        "close": "134.87",
        "volume": "2070939",
        "name": "AGILENT TECHNOLOGIES"
      }];

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: responseMock }) as any);

      const response = await Promise.all([
        stockController.getStocks('blabal'),
        stockController.getStocks('blabal'),
        stockController.getStocks('blabal'),
        stockController.getStocks('blabal'),
        stockController.getStocks('blabal')
      ]);

      expect(response.every((x) => x === responseMock)).toBe(true);
    });

  });

});
