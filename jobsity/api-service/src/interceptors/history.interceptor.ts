import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProvider } from '../modules/database/user/user.provider';
import { HistoryProvider } from '../modules/database/history/history.provider';

@Injectable()
export class HistoryInterceptor implements NestInterceptor {
  constructor(
    private historyProvider: HistoryProvider,
    private userProvider:UserProvider
  ) {

  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {    
    return next
      .handle()
      .pipe(
        tap((response) => {
          this.historyProvider.insert({
            data: response[0],
            type:context.switchToHttp().getRequest().url.split('?')[0],
            _idUser: context.switchToHttp().getRequest().user.userId
          });
        }),
      );
  }
}