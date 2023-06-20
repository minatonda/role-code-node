import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
  ) {

  }

  public getStocks(stockCode: string) {
    return this.httpService.get(`https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcvn&h&e=csv`).toPromise().then((response) => {
      console.log(response.data);
      response.data.split('\n');

      const lines: string[] = response.data.split('\r\n').slice(0, -1);
      const columns = lines[0].split(',').map((c) => this.camelize(c));
      return lines.slice(1).map((line) => {
        const values = line.split(',');
        return columns.reduce((a, v, i) => {
          if(v==='date'){
            return ({ ...a, [v]: moment(`${values[i]} ${values[i+1]}`,'YYYY-MM-DD HH:mm:ss') });
          }
          if(v==='time'){
            return a;
          }
         return ({ ...a, [v]: values[i] })
        }, {});
      });
      // return response.data;
    });
  }

  private camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
}