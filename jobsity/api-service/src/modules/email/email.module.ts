import { DynamicModule, Module } from '@nestjs/common';
import { AccountMailProvider } from './account-mail.provider';

@Module({})
export class EmailModule {
    static forRoot(host: string = '', port: number = 587, user: string = '', pass: string = ''): DynamicModule {
        const HostProvider = { provide: 'HOST', useValue: host };
        const PortProvider = { provide: 'PORT', useValue: port };
        const UserProvider = { provide: 'USER', useValue: user };
        const PassProvider = { provide: 'PASS', useValue: pass };
        return {
            module: EmailModule,
            providers: [AccountMailProvider, HostProvider, PortProvider, UserProvider, PassProvider],
            exports: [AccountMailProvider]
        };
    }
}
