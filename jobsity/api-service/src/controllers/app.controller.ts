import { Body, Controller, Get, Post, Req, UseGuards, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import RoleGuard from 'src/modules/auth/guards/role.guard';
import { JwtGuard } from '../modules/auth/guards/jwt.guard';
import { UserModel } from '../modules/database/user/user.model';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Post('/register')
  @ApiOperation({ description: "Do Registration of a new user" })
  public register(@Body() user: UserModel): Promise<UserModel> {
    return this.appService.register(user);
  }

  @Post('/login')
  @ApiOperation({ description: "Do Login and retrive JWT Token" })
  public login(@Body() user: UserModel): Promise<{ access_token: string }> {
    return this.appService.login(user);
  }

  @Post('/change-password')
  @ApiOperation({ description: "Do Password Change for logged user" })
  @UseGuards(JwtGuard, RoleGuard('admin'))
  public changePassword(@Req() request: Request): Promise<UserModel> {
    return this.appService.changePassword((request as any).user['username']);
  }

  @Get('/history')
  @ApiOperation({ description: "Retrieve the history of requests from logged user" })
  @UseGuards(JwtGuard)
  public history(@Req() request: Request) {
    return this.appService.history((request as any).user['userId']);
  }

  @Get('/stats')
  @ApiOperation({ description: "Retrieve the stats of requests from logged user" })
  @UseGuards(JwtGuard)
  public stats(@Req() request: Request) {
    return this.appService.stats((request as any).user['userId']);
  }

}
