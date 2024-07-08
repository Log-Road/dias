import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SESClient } from '@aws-sdk/client-ses';

@Module({
  controllers: [UserController],
  providers: [Logger, UserService, PrismaService, JwtService, SESClient],
})
export class UserModule {}
