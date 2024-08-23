import { Logger, Module } from "@nestjs/common";
import { CompetitionController } from "./competition.controller";
import { CompetitionService } from "./competition.service";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [CompetitionController],
  providers: [
    CompetitionService,
    PrismaService,
    UserPrismaService,
    JwtService,
    Logger,
  ],
})
export class CompetitionModule {}
