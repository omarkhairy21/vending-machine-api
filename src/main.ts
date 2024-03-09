import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const logger = new Logger('VendingMachine');
  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('Vending Machine')
    .setDescription('Vending machine API')
    .setVersion('1.0')
    .addTag('vending-machine')
    .addSecurityRequirements('bearer')

    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
