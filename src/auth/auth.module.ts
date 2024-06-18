import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthUtil } from "../utils/auth.util";
import SendEmail from "src/middleware/send-email";
import { SESClient } from "@aws-sdk/client-ses";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategyService } from "./strategies/google/google.strategy.service";
import { JwtStrategyService } from "./strategies/jwt/jwt.strategy.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        secretOrPrivateKey: config.get<string>("JWT_PRIVATE"),
        signOptions: {
          expiresIn: "30m",
        },
        verifyOptions: {
          complete: false,
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [
    AuthService,
    Logger,
    PrismaService,
    AuthUtil,
    SendEmail,
    SESClient,
    GoogleStrategyService,
    JwtStrategyService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
