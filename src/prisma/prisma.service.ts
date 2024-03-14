import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findUserByStrId(userId: string) {
    return await this.user.findUnique({
      where: { userId },
    });
  }

  async findUserById(id: number) {
    return await this.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return await this.user.findUnique({
      where: { email },
    });
  }
}
