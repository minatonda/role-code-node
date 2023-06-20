import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { StockProvider } from './stock/stock.provider';


@Module({
    imports: [HttpModule],
    providers: [StockProvider],
    exports: [StockProvider]
})
export class CrossApiModule { }
