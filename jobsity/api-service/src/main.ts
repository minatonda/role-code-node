import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api Service')
    .setDescription('The Jobsity Api Service')
    .setVersion('1.0')
    .addTag('Jobsity')
    .build();
  const document = SwaggerModule.createDocument(app, config,{
    deepScanRoutes:true,
    
  });
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
