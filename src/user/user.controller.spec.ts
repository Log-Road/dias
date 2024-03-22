import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    jest.doMock('prisma');
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, Logger, PrismaService, ConfigService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('signUp', () => {
    const response = {
      data: null,
      statusCode: 201,
      statusMsg: 'OK',
    };

    it('[200] 학생 회원가입 성공', async () => {
      const signUp = jest.spyOn(service, 'signUp').mockImplementation(null);

      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      const data = await controller.signUp(request);

      await expect(signUp).toBeCalledTimes(1);
      await expect(data).toStrictEqual(response);
    });

    it('[200] 선생님 회원가입 성공', async () => {
      const signUp = jest.spyOn(service, 'signUp').mockImplementation(null);

      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        password: 'thisIsTest1!',
        isStudent: false,
      };

      const data = await controller.signUp(request);

      expect(signUp).toBeCalledTimes(1);
      expect(data).toEqual(response);
    });

    it('[409] 이미 존재하는 학번', async () => {
      const signUp = jest.spyOn(service, 'signUp');

      const request = {
        name: '홍길동',
        userId: 'hogGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      jest
        .spyOn(prisma, 'findUserByNumber')
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));

      await expect(async () => await controller.signUp(request)).rejects.toThrowError(
        new ConflictException('이미 존재하는 학번'),
      );
    });

    it('[409] 이미 존재하는 아이디', async () => {
      const signUp = jest.spyOn(service, 'signUp');
      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));

      const request = {
        name: '홍길동',
        userId: 'hogGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      await expect(async () => await controller.signUp(request)).rejects.toThrowError(
        new ConflictException('이미 존재하는 Id'),
      );
    });

    it('[409] 이미 존재하는 이메일 주소', async () => {
      const signUp = jest.spyOn(service, 'signUp');
      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));

      const request = {
        name: '홍길동',
        userId: 'hogGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      await expect(
        async () => await controller.signUp(request),
      ).rejects.toThrowError(new ConflictException('이미 존재하는 이메일'));
    });
  });
});
