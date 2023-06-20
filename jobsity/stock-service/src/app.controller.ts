import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('stocks')
  public getStocks(@Query('stockCode') stockCode) {
    return this.appService.getStocks(stockCode);
  }
  
}
