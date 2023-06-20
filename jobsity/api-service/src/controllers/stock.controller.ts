import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { HistoryInterceptor } from '../interceptors/history.interceptor';
import { StockProvider } from '../modules/cross-api/stock/stock.provider';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from '../modules/auth/guards/jwt.guard';


@Controller('/stocks')
@UseGuards(JwtGuard)
export class StockController {
  constructor(private readonly stockProvider: StockProvider) {

  }


  @Get()
  @ApiOperation({ description: "Retrieve the stocks by an stock code" })
  @ApiQuery({ name: 'stockCode', type: String })
  @UseInterceptors(HistoryInterceptor)
  public getStocks(@Query('stockCode') stockCode) {
    return this.stockProvider.getStocks(stockCode);
  }

}
