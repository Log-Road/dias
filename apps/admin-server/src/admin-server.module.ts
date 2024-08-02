import { Module } from "@nestjs/common";
import { ClubModule } from "./club/club.module";
import { ConfigModule } from "@nestjs/config";
import { WinstonInstance } from "apps/dias/src/utils/winston.util";
import { WinstonModule } from "nest-winston";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: "../../../.env"
    }),
    WinstonModule.forRoot({
      instance: WinstonInstance,
    }),
    ClubModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminServerModule {}
