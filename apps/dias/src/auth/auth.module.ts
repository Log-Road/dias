import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthUtil } from "../utils/auth.util";
import SendEmail from "../middleware/send-email";
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
