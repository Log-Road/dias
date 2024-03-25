import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        Logger,
        PrismaService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('/signin', () => {
    it('[200] 로그인 성공', async () => {
      const request = {
        userId: 'honGil',
        password: 'thisIsTest1!',
      };

      const data = {
        accesstoken: 'testcodeaccesstoken',
        expiredAt: '2024-03-25T03:25:59.238Z',
        refreshtoken: 'testcoderefreshtoken',
      }

      const response = {
        data,
        statusCode: 201,
        statusMsg: '로그인',
      }

      jest.spyOn(service, 'signIn').mockImplementation(async () => await data);

      const res = controller.signIn(request);

      await expect(res).resolves.toStrictEqual(response);
    });

    it('[400]', async () => {
      jest.spyOn(service, 'signIn').mockImplementation(async () => {
        throw new BadRequestException('비밀번호 오입력');
      });
      await expect(
        async () =>
          await controller.signIn({
            userId: 'honGil',
            password: 'thisIsTes1!',
          }),
      ).rejects.toThrowError(new BadRequestException('비밀번호 오입력'));
    });

    it('[404]', async () => {
      jest.spyOn(service, 'signIn').mockImplementation(async () => {
        throw new NotFoundException();
      });
      await expect(
        async () =>
          await controller.signIn({
            userId: 'hongGil',
            password: 'thisIsTest1!',
          }),
      ).rejects.toThrowError(new NotFoundException());
    });
  });
});
