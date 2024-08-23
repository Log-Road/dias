import { NestFactory } from "@nestjs/core";
import { AdminServerModule } from "./admin-server.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "../../dias/src/http.exception/http.exception.filter";
import { CorsOptions } from "../../dias/src/utils/corsOption.util";
import { WinstonInstance } from "../../dias/src/utils/winston.util";
import { configDotenv } from "dotenv";
import { WinstonModule } from "nest-winston";
import { JwtAuthGuard } from "../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AdminValidateGuard } from "./guard/adminValidator/adminValidator.guard";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../dias/src/prisma/prisma.service";

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
  app.useGlobalGuards(
    new AdminValidateGuard(
      new JwtAuthGuard(
        new JwtService(),
        new PrismaService(new ConfigService()),
      ),
    ),
  );

  await app.listen(8002, () => {
    console.log("admin-server started");
  });
}
bootstrap();
