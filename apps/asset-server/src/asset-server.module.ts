import { Module } from "@nestjs/common";
import { AssetServerController } from "./asset-server.controller";
import { AssetServerService } from "./asset-server.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "apps/dias/src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { RoleGuard } from "apps/dias/src/guard/role/role.guard";

@Module({
  imports: [],
  controllers: [AssetServerController],
  providers: [AssetServerService, JwtService, PrismaService, ConfigService],
})
export class AssetServerModule {}
