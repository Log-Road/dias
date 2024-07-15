import { Module } from "@nestjs/common";
import { RoadService } from "./road.service";
import { RoadController } from "./road.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [
    RoadService,
    PrismaService,
    JwtAuthGuard,
    UserPrismaService,
    JwtService,
  ],
  controllers: [RoadController],
})
export class RoadModule {}
