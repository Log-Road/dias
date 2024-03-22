import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { SignUpReq } from '../dtos/signUp.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, Logger],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {});

  describe('signUp Success', () => {
    it('success - student', async () => {
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

      expect(
        await service.signUp(request),
      ).toBeNull();
    });

    it('success - teacher', async () => {
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

      expect(
        await service.signUp(request),
      ).toBeNull();
    });
  });

  describe('signUp Failed', () => {
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
});
