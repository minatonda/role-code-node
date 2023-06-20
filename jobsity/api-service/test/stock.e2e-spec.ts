import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { EmailModule } from '../src/modules/email/email.module';
import { AppService } from '../src/services/app.service';
import * as request from 'supertest';
import { APP_CONSTANTS } from '../src/app.constants';
import { AppController } from '../src/controllers/app.controller';
import { StockController } from '../src/controllers/stock.controller';
import { HistoryInterceptor } from '../src/interceptors/history.interceptor';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CrossApiModule } from '../src/modules/cross-api/cross-api.module';
import { StockModel } from '../src/modules/cross-api/stock/stock.model';
import { DatabaseModule } from '../src/modules/database/database.module';

describe('StockController (e2e)', () => {
  let app: INestApplication;

  async function deStartApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CrossApiModule,
        AuthModule.forRoot(APP_CONSTANTS.jwtSecret, APP_CONSTANTS.jwtExpiresIn, ''),
        DatabaseModule.forRoot(''),
        EmailModule.forRoot()
      ],
      providers: [
        AppService, HistoryInterceptor
      ],
      controllers: [AppController, StockController]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }

  beforeEach(async () => await deStartApp());

  it(`/stocks (GET)`, async () => {

    const mock = doMockHttpService();

    return request(app.getHttpServer())
      .post('/register')
      .send({ email: 'johndoe-history@contoso.com', role: 'user' })
      .expect(201)
      .then((response) =>
        request(app.getHttpServer())
          .post('/login')
          .send({ email: 'johndoe-history@contoso.com', password: response.body.password })
          .expect(201)
          .then((response) =>
            request(app.getHttpServer())
              .get('/stocks')
              .set('Authorization', `Bearer ${response.body.access_token}`)
              .send({ email: 'johndoe-history@contoso.com', role: 'user' })
              .expect(200)
              .expect((response) => response.body[0] === mock[0])
          )
      );

    function doMockHttpService() {
      const httpService = app.get<HttpService>(HttpService);
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
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: responseMock }) as any);
      return responseMock;
    }

  });

});
