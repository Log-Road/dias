import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignUpReq } from '../dtos/signUp.dto';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash } from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, Logger, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {});

  describe('signUp', () => {
    it('[200] 학생 회원가입 성공', async () => {
      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementation(async (stdId: string) => null);

      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      expect(await service.signUp(request)).toBeNull();
    });

    it('[200] 선생님 회원가입 성공', async () => {
      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, 'findUserByNumber')
        .mockImplementation(async (number: number) => null);

      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        password: 'thisIsTest1!',
        isStudent: false,
      };

      expect(await service.signUp(request)).toBeNull();
    });

    it('[400] 필수 요소 불충족', async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        password: 'thisIsTest1!',
        isStudent: true,
      };

      await expect(
        async () => await service.signUp(request as SignUpReq),
      ).rejects.toThrowError(new BadRequestException('제약조건 위반'));
    });

    it("[400] 제약 조건 불충족 - isStudent is true but there's no number", async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        password: 'thisIsTest1!',
        isStudent: true,
      };

      expect(async () => await service.signUp(request)).rejects.toThrowError(
        new BadRequestException('제약조건 위반'),
      );
    });

    it('[400] 제약 조건 불충족 - isStudent is false but number is exist', async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: false,
      };

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new BadRequestException('제약조건 위반'));
    });

    it('[409] 상태 충돌 - entered exist email', async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementation(async (email: string) =>
          Object.assign(request, { id: 1 }),
        );

      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, 'findUserByNumber')
        .mockImplementation(async (number: number) => null);

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException('이미 존재하는 이메일'));
    });

    it('[409] 상태 충돌 - entered exist userId', async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementationOnce(async (stdId: string) =>
          Object.assign(request, { id: 1 }),
        );

      jest
        .spyOn(prisma, 'findUserByNumber')
        .mockImplementation(async (number: number) => null);

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException('이미 존재하는 Id'));
    });

    it('[409] 상태 충돌 - entered exist number', async () => {
      const request = {
        name: '홍길동',
        userId: 'honGil',
        email: 'dongil@dsm.hs.kr',
        number: 1111,
        password: 'thisIsTest1!',
        isStudent: true,
      };

      jest
        .spyOn(prisma, 'findUserByEmail')
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, 'findUserByStrId')
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, 'findUserByNumber')
        .mockImplementationOnce(async (number: number) =>
          Object.assign(request, { id: 1 }),
        );

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException('이미 존재하는 학번'));
    });
  });

  describe('findId', () => {
    const request = {
      email: 'dongil@dsm.hs.kr',
    };

    it('[200] success find Id', async () => {
      jest.spyOn(prisma, 'findUserByEmail').mockImplementationOnce(
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

      await expect(service.findId(request)).resolves.toStrictEqual('honGil');
    });

    it('[404] 존재하지 않는 유저', async () => {
      jest.spyOn(prisma, 'findUserByEmail').mockImplementationOnce(null);

      await expect(
        async () => await service.findId(request),
      ).rejects.toThrowError(new NotFoundException('존재하지 않는 유저'));
    });
  });

  describe('findPassword', () => {
    const request = {
      userId: 'honGil',
    };

    (genSalt as jest.Mock) = jest.fn().mockResolvedValue('Th^Isi@SS_Alt');
    (hash as jest.Mock) = jest.fn().mockResolvedValue(null);

    it('[200] 요청 성공', async () => {
      jest.spyOn(prisma, 'findUserByStrId').mockImplementation(
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
      jest.spyOn(prisma, 'updateUserPassword').mockImplementation(null);

      await expect(service.findPassword(request)).resolves.toStrictEqual({
        temporary: 'Th^Isi@SS_Alt',
      });
    });

    it('[400] 비밀번호 수정 실패', async () => {
      jest.spyOn(prisma, 'findUserByStrId').mockImplementation(
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
      jest.spyOn(prisma, 'updateUserPassword').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(
        async () => await service.findPassword(request),
      ).rejects.toThrowError(new BadRequestException('비밀번호 수정 실패'));
    });

    it('[404] 존재하지 않는 유저', async () => {
      jest.spyOn(prisma, 'findUserByStrId').mockImplementation(null);
      jest.spyOn(prisma, 'updateUserPassword').mockImplementation(null);

      await expect(
        async () => await service.findPassword(request),
      ).rejects.toThrowError(new NotFoundException('존재하지 않는 유저'));
    });
  });
});
