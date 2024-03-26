import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        Logger,
        ConfigService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    jest.spyOn(service, 'genAccessToken').mockImplementation(async () => ({
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzExMzQwNzU5fQ.0UbgRd-ZxhNdAnFvVtatAiNpALsxEkf-vDTpy9zfNIQ',
      expiredAt: '2024-03-25T03:25:59.238Z',
    }));
    jest.spyOn(service, 'genRefreshToken').mockImplementation(async () => ({
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY',
    }));
  });

  describe('signIn', () => {
    it('[200] success to login', async () => {
      const request = {
        userId: 'honGil',
        password: 'thisIsTest1!',
      };

      const response = {
        id: 1,
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzExMzQwNzU5fQ.0UbgRd-ZxhNdAnFvVtatAiNpALsxEkf-vDTpy9zfNIQ',
        expiredAt: '2024-03-25T03:25:59.238Z',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY',
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
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(async () => await true);

      await expect(service.signIn(request)).resolves.toStrictEqual(response);
    });

    it('[400] failed to login with wrong password', async () => {
      const request = {
        userId: 'honGil',
        password: '1daf2341dfae!',
      };

      await expect(
        async () => await service.signIn(request),
      ).rejects.toThrowError(new BadRequestException('비밀번호 오입력'));
    });

    it('[404] User not found with wrong id', async () => {
      const request = {
        userId: 'hoonGil',
        password: 'thisIsTest1!',
      };

      await expect(
        async () => await service.signIn(request),
      ).rejects.toThrowError(new NotFoundException());
    });
  });

  describe('regenerate refreshtoken', () => {
    it('[200] success', async () => {
      const request =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTM4MjA2OSwiZXhwIjoxNzEyNTkxNjY5fQ.8ggYTBXBtPqcfveXX4nVAHUJYzp0uaeyAKAoQxxqVUE';

      const response = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzExMzQwNzU5fQ.0UbgRd-ZxhNdAnFvVtatAiNpALsxEkf-vDTpy9zfNIQ',
        expiredAt: '2024-03-25T03:25:59.238Z',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY',
      };

      await expect(service.verifyToken(request)).resolves.toStrictEqual(
        response,
      );
    });

    it('[404] 존재하지 않는 사용자 아이디', async () => {
      const request =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY';

      jest.spyOn(prisma, 'findUserById').mockImplementationOnce(null);

      await expect(
        async () => await service.verifyToken(request),
      ).rejects.toThrowError(new NotFoundException('존재하지 않는 유저'));
    });

    it('[500] Internal Server Error - Bearer Token 양식 위반', async () => {
      const request =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY';

      await expect(
        async () => await service.verifyToken(request),
      ).rejects.toThrowError(
        new InternalServerErrorException('jwt must be provided'),
      );
    });

    it('[500] Internal Server Error - Token 시간 만료', async () => {
      const request =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY';

      jest.spyOn(jwt, 'verifyAsync').mockImplementation(async () => {
        throw new InternalServerErrorException();
      });

      await expect(
        async () => await service.verifyToken(request),
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });
});
