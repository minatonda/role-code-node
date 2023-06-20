import { DynamicModule, Module } from '@nestjs/common';
import { HistoryProvider } from './history/history.provider';
import { UserProvider } from './user/user.provider';


@Module({})
export class DatabaseModule {
    static forRoot(path: string = ''): DynamicModule {
        const PathProvider = { provide: 'PATH', useValue: path };
        return {
            module: DatabaseModule,
            providers: [HistoryProvider, UserProvider, PathProvider],
            exports: [HistoryProvider, UserProvider]
        };
    }
}
