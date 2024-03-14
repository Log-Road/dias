import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from './utils/corsOption.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http.exception/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonInstance } from './utils/winston.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: CorsOptions,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  const docs = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Dauth')
      .setVersion('0.0.1')
      .setDescription('Dauth - DSM Intergrated Account Solution')
      .addBearerAuth({
        type: 'http',
        in: 'header',
        scheme: 'Bearer',
        name: 'authorization',
      })
      .build(),
  );

  SwaggerModule.setup('docs', app, docs);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: process.env.NODE_ENV === 'prod' ? true : false,
    }),
  );

  console.log(process.env.PORT)
  await app.listen(process.env.PORT ?? 8888);
}
bootstrap();
