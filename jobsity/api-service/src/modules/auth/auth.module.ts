import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';


@Module({})
export class AuthModule {
  static forRoot(jwtSecret: string = '', jwtExpiresIn: string = '', path: string = ''): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        DatabaseModule.forRoot(path),
        PassportModule,
        JwtModule.register({
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiresIn },
        })
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [AuthService]
    };
  }
}
