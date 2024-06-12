import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthUtil } from "../utils/auth.util";
import SendEmail from "src/middleware/send-email";
import { SESClient } from "@aws-sdk/client-ses";

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
  ],
  providers: [AuthService, Logger, PrismaService, AuthUtil, SendEmail, SESClient],
  controllers: [AuthController],
})
export class AuthModule {}
