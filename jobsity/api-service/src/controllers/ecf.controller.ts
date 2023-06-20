import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../modules/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/ecf')
@UseGuards(JwtGuard)
export class EcfController {

  constructor() {

  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Get()
  // @ApiOperation({ description: "Retrieve analisys" })
  // @ApiQuery({ name: 'cnpj', type: String })
  // @UseInterceptors(HistoryInterceptor)
  public getAnalisys(@Query('cnpj') cnpj) {
    
  }

}
