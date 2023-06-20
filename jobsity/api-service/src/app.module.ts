import { Module } from '@nestjs/common';
import { APP_CONSTANTS } from './app.constants';
import { AppController } from './controllers/app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { StockController } from './controllers/stock.controller';
import { DatabaseModule } from './modules/database/database.module';
import { EmailModule } from './modules/email/email.module';
import { CrossApiModule } from './modules/cross-api/cross-api.module';
import { HistoryInterceptor } from './interceptors/history.interceptor';
import { AppService } from './services/app.service';
import { EcfController } from './controllers/ecf.controller';


@Module({
  imports: [
    CrossApiModule,
    AuthModule.forRoot(APP_CONSTANTS.jwtSecret, APP_CONSTANTS.jwtExpiresIn, APP_CONSTANTS.dbPath),
    DatabaseModule.forRoot(APP_CONSTANTS.dbPath),
    EmailModule.forRoot(APP_CONSTANTS.emailHost, APP_CONSTANTS.emailPort, APP_CONSTANTS.emailUser, APP_CONSTANTS.emailPass)
  ],
  providers: [HistoryInterceptor, AppService],
  controllers: [AppController, StockController, EcfController]
})
export class AppModule { }
