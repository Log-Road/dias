import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, Logger, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.spyOn(service, 'genAccessToken').mockImplementation(async () => ({
      accessToken: '',
      expiredAt: '',
    }));
    jest.spyOn(service, 'genRefreshToken').mockImplementation(async () => ({
      refreshToken: '',
    }));
  });

  describe('signIn', () => {
    it('[200] success to login', async () => {
      const request = {
        userId: 'honGil',
        password: 'thisIsTest1!',
      };

      jest.spyOn(prisma, 'findUserByStrId').mockImplementationOnce(
        async () =>
          await {
            id: 1,
            name: '홍길동',
            userId: 'honGil',
            email: 'dongil@dsm.hs.kr',
            number: 1111,
            password: 'thisIsTest1!',
            isStudent: true,
          },
      );

      await expect(await service.signIn(request)).resolves.toBe({});
    });

    it('[400] failed to login with wrong password', async () => {
      const request = {
        userId: 'honGil',
        password: '1daf2341dfae!',
      };

      await expect(await service.signIn(request)).rejects.toThrowError(
        new BadRequestException(''),
      );
    });

    it('[404] User not found with wrong id', async () => {
      const request = {
        userId: 'hoonGil',
        password: 'thisIsTest1!',
      };

      await expect(await service.signIn(request)).rejects.toThrowError(
        new NotFoundException(''),
      );
    });
  });
});
