import { NestFactory } from '@nestjs/core';
import { AdminServerModule } from './admin-server.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from 'apps/dias/src/http.exception/http.exception.filter';
import { CorsOptions } from 'apps/dias/src/utils/corsOption.util';
import { WinstonInstance } from 'apps/dias/src/utils/winston.util';
import { configDotenv } from 'dotenv';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  configDotenv({
    path: "../../../.env",
  });

  const app = await NestFactory.create(AdminServerModule, {
    cors: CorsOptions,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: true,
    }),
  );

  await app.listen(8002, () => {
    console.log('admin-server started')
  });
}
bootstrap();
