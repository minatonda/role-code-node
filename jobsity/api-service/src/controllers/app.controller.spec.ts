import { Test, TestingModule } from '@nestjs/testing';
import { APP_CONSTANTS } from '../app.constants';
import { AppController } from './app.controller';
import { AuthModule } from '../modules/auth/auth.module';
import { DatabaseModule } from '../modules/database/database.module';
import { AppService } from '../services/app.service';
import { EmailModule } from '../modules/email/email.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        AuthModule.forRoot(APP_CONSTANTS.jwtSecret, APP_CONSTANTS.jwtExpiresIn, ''),
        DatabaseModule.forRoot(),
        EmailModule.forRoot()
      ],
      providers: [
        AppService
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('app.controler', () => {

    it('should register a new user and return password', async () => {
      const response = await appController.register({ email: 'johndoe-register@contoso.com', role: 'user' } as any);
      expect(response.password).toBeDefined();
    });

    it('should login and return access_token', async () => {
      const responseRegister = await appController.register({ email: 'johndoe-login@contoso.com', role: 'user' } as any);
      const responseLogin = await appController.login({ email: responseRegister.email, password: responseRegister.password } as any);

      expect(responseRegister.password).toBeDefined();
      expect(responseLogin.access_token).toBeDefined();
    });

  });

});
