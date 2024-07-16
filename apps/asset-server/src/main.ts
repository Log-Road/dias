import { NestFactory } from "@nestjs/core";
import { AssetServerModule } from "./asset-server.module";
import { configDotenv } from "dotenv";
import { CorsOptions } from "apps/dias/src/utils/corsOption.util";
import { WinstonInstance } from "apps/dias/src/utils/winston.util";
import { WinstonModule } from "nest-winston";
import { ValidationPipe, Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "apps/dias/src/http.exception/http.exception.filter";

async function bootstrap() {
  configDotenv({
    path: "../../../.env",
  });

  const app = await NestFactory.create(AssetServerModule, {
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

  await app.listen(8001, () => {
    console.log("asset-server started");
  });
}
bootstrap();
