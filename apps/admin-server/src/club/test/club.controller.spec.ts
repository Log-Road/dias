import { Test, TestingModule } from '@nestjs/testing';
import { ClubController } from '../club.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaService as UserPrismaService } from '../../../../dias/src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClubService } from '../club.service';

describe('ClubController', () => {
  let controller: ClubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [ClubService, ConfigService, PrismaService, UserPrismaService, JwtService, Logger]
    }).compile();

    controller = module.get<ClubController>(ClubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
