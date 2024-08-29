import { Logger, Module } from "@nestjs/common";
import { RoadService } from "./road.service";
import { RoadController } from "./road.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "apps/dias/src/auth/strategies/jwt/jwt.auth.guard";

@Module({
  providers: [
    RoadService,
    PrismaService,
    JwtAuthGuard,
    UserPrismaService,
    JwtService,
    Logger,
  ],
  controllers: [RoadController],
})
export class RoadModule {}
