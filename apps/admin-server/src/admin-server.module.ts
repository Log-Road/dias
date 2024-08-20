import { Module } from "@nestjs/common";
import { ClubModule } from "./club/club.module";
import { ConfigModule } from "@nestjs/config";
import { WinstonInstance } from "apps/dias/src/utils/winston.util";
import { WinstonModule } from "nest-winston";
import { PersonModule } from './person/person.module';

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
    PersonModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminServerModule {}
