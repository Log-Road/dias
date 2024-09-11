import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "./client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get("POSTGRESQL_DB_URL"),
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
    return this.user.findUnique({
      where: { userId },
    });
  }

  async findUserById(id: string) {
    return this.user.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        number: true,
        provided: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  async findUserByNumber(number?: number) {
    if (!number) throw new BadRequestException("학번 필요");

    return this.user.findUnique({
      where: { number },
    });
  }

  async updateUserPassword(userId: string, password: string) {
    await this.user.update({
      where: {
        userId,
      },
      select: {
        password: true,
      },
      data: {
        password,
      },
    });
  }

  async updateUserInform(id: string, email: string) {
    await this.user.update({
      where: { id },
      select: { email: true },
      data: { email },
    });
  }
}
