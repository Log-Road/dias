import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { WinstonInstance } from './utils/winston.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'prod'
          ? '.env.prod'
          : process.env.NODE_ENV == 'dev'
          ? '.env.dev'
          : '.env.local',
    }),
    WinstonModule.forRoot({
      instance: WinstonInstance,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [Logger, PrismaService],
})
export class AppModule {}
