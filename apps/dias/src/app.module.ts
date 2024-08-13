import { Logger, Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from "./prisma/prisma.service";
import { WinstonModule } from "nest-winston";
import { ConfigModule } from "@nestjs/config";
import { WinstonInstance } from "./utils/winston.util";
import SendEmail from "./middleware/send-email";
import { SESClient } from "@aws-sdk/client-ses";
import { AuthUtil } from "./utils/auth.util";
import { JwtService } from "@nestjs/jwt";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == "prod"
          ? ".env"
          : process.env.NODE_ENV == "dev"
          ? ".env.dev"
          : ".env.local",
    }),
    WinstonModule.forRoot({
      instance: WinstonInstance,
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
      }
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    Logger,
    PrismaService,
    SendEmail,
    SESClient,
    AuthUtil,
    JwtService,
  ],
})
export class AppModule {}
