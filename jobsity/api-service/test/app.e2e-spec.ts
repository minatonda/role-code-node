import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { APP_CONSTANTS } from './../src/app.constants';
import { AppController } from '../src/controllers/app.controller';
import { AuthModule } from './../src/modules/auth/auth.module';
import { StockController } from './../src/controllers/stock.controller';
import { DatabaseModule } from './../src/modules/database/database.module';
import { CrossApiModule } from '../src/modules/cross-api/cross-api.module';
import { HistoryInterceptor } from './../src/interceptors/history.interceptor';
import * as assert from 'assert';
import { StockModel } from '../src/modules/cross-api/stock/stock.model';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AppService } from '../src/services/app.service';
import { EmailModule } from '../src/modules/email/email.module';

describe('AppController (e2e)', () => {
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

  it('/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send({ email: 'johndoe-register@contoso.com', role: 'user' })
      .expect(201)
      .expect((response) => assert(!!response.body.password, '"password" not generated'));
  });

  it('/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send({ email: 'johndoe-login@contoso.com', role: 'user' })
      .expect(201)
      .then((response) =>
        request(app.getHttpServer())
          .post('/login')
          .send({ email: 'johndoe-login@contoso.com', password: response.body.password })
          .expect(201)
          .expect((response) => assert(!!response.body.access_token, '"access_token" not returned'))
      );
  });

  for (let x = 1; x <= 5; x++) {
    it(`/history e /stats (GET) with ${x} requests logged on history`, async () => {

      await deStartApp();
      doMockHttpService();

      return request(app.getHttpServer())
        .post('/register')
        .send({ email: 'johndoe-history@contoso.com', role: 'user' })
        .expect(201)
        .then((response) =>
          request(app.getHttpServer())
            .post('/login')
            .send({ email: 'johndoe-history@contoso.com', password: response.body.password })
            .expect(201)
            .then(async (response) => doRecursive(response.body.access_token, x))
        );

      function doRecursive(access_token: string, times: number, time: number = 1) {
        if (time <= times) {

          return request(app.getHttpServer())
            .get('/stocks')
            .set('Authorization', `Bearer ${access_token}`)
            .send({ email: 'johndoe-history@contoso.com', role: 'user' })
            .expect(200)
            .then((responseStocks) => Promise.all([
              request(app.getHttpServer())
                .get('/history')
                .set('Authorization', `Bearer ${access_token}`)
                .send()
                .expect(200)
                .expect((responseHistory) => assert(responseHistory.body.length === time, '"history not saved')),
              request(app.getHttpServer())
                .get('/stats')
                .set('Authorization', `Bearer ${access_token}`)
                .send()
                .expect(200)
                .expect((responseHistory) => assert(responseHistory.body.length === 1 && responseHistory.body[0]['times_requested'] === time, '"history not saved')),
            ])
              .then((response) => doRecursive(access_token, times, time + 1))
            );
        }

      }

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
      }

    });
  }

});
