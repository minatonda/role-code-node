import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { StockModel } from "./stock.model";

@Injectable()
export class StockProvider {

    constructor(
        private httpService: HttpService,
    ) {

    }

    public getStocks(stockCode: string) {
        return this.httpService.get<StockModel[]>(`http://localhost:3001/stocks?stockCode=${stockCode}`).toPromise().then((response) => response.data);
    }

}