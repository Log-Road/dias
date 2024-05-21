import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { PrismaService } from "../../prisma/prisma.service";
import { mockDeep } from "jest-mock-extended";
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { SignUpReq } from "../dto/request/signUp.request.dto";
import { ConfigService } from "@nestjs/config";
import { genSalt, hash } from "bcrypt";

describe("UserService", () => {
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

  describe("signUp", () => {
    it("[200] 학생 회원가입 성공", async () => {
      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementation(async (stdId: string) => null);

      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      expect(await service.signUp(request)).toBeNull();
    });

    it("[200] 선생님 회원가입 성공", async () => {
      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementation(async (number: number) => null);

      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        password: "thisIsTest1!",
        isStudent: false,
      };

      expect(await service.signUp(request)).toBeNull();
    });

    it("[400] 필수 요소 불충족", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        password: "thisIsTest1!",
        isStudent: true,
      };

      await expect(
        async () => await service.signUp(request as SignUpReq),
      ).rejects.toThrowError(new BadRequestException("제약조건 위반"));
    });

    it("[400] 제약 조건 불충족 - isStudent is true but there's no number", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        password: "thisIsTest1!",
        isStudent: true,
      };

      expect(async () => await service.signUp(request)).rejects.toThrowError(
        new BadRequestException("제약조건 위반"),
      );
    });

    it("[400] 제약 조건 불충족 - isStudent is false but number is exist", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: false,
      };

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new BadRequestException("제약조건 위반"));
    });

    it("[409] 상태 충돌 - entered exist email", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementation(async (email: string) =>
          Object.assign(request, { id: 1 }),
        );

      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementation(async (number: number) => null);

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 이메일"));
    });

    it("[409] 상태 충돌 - entered exist userId", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementationOnce(async (stdId: string) =>
          Object.assign(request, { id: 1 }),
        );

      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementation(async (number: number) => null);

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 Id"));
    });

    it("[409] 상태 충돌 - entered exist number", async () => {
      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementation(async (email: string) => null);

      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementation(async (stdId: string) => null);

      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementationOnce(async (number: number) =>
          Object.assign(request, { id: 1 }),
        );

      await expect(
        async () => await service.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 학번"));
    });
  });

  describe("findId", () => {
    const request = {
      email: "dongil@dsm.hs.kr",
    };

    it("[200] success find Id", async () => {
      jest.spyOn(prisma, "findUserByEmail").mockImplementationOnce(
        async () =>
          await {
            id: 1,
            name: "홍길동",
            userId: "honGil",
            email: "dongil@dsm.hs.kr",
            number: 1111,
            password: "thisIsTest1!",
            isStudent: true,
          },
      );

      await expect(service.findId(request)).resolves.toStrictEqual("honGil");
    });

    it("[404] 존재하지 않는 유저", async () => {
      jest.spyOn(prisma, "findUserByEmail").mockImplementationOnce(null);

      await expect(
        async () => await service.findId(request),
      ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    });
  });

  describe("findPassword", () => {
    const request = {
      userId: "honGil",
    };

    (genSalt as jest.Mock) = jest.fn().mockResolvedValue("Th^Isi@SS_Alt");
    (hash as jest.Mock) = jest.fn().mockResolvedValue(null);

    it("[200] 요청 성공", async () => {
      jest.spyOn(prisma, "findUserByStrId").mockImplementation(
        async () =>
          await {
            id: 1,
            name: "홍길동",
            userId: "honGil",
            email: "dongil@dsm.hs.kr",
            number: 1111,
            password: "thisIsTest1!",
            isStudent: true,
          },
      );
      jest.spyOn(prisma, "updateUserPassword").mockImplementation(null);

      await expect(service.findPassword(request)).resolves.toStrictEqual({
        temporary: "Th^Isi@SS_Alt",
      });
    });

    it("[400] 비밀번호 수정 실패", async () => {
      jest.spyOn(prisma, "findUserByStrId").mockImplementation(
        async () =>
          await {
            id: 1,
            name: "홍길동",
            userId: "honGil",
            email: "dongil@dsm.hs.kr",
            number: 1111,
            password: "thisIsTest1!",
            isStudent: true,
          },
      );
      jest.spyOn(prisma, "updateUserPassword").mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(
        async () => await service.findPassword(request),
      ).rejects.toThrowError(new BadRequestException("비밀번호 수정 실패"));
    });

    it("[404] 존재하지 않는 유저", async () => {
      jest.spyOn(prisma, "findUserByStrId").mockImplementation(null);
      jest.spyOn(prisma, "updateUserPassword").mockImplementation(null);

      await expect(
        async () => await service.findPassword(request),
      ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    });
  });
  /* TODO : Have to repair test cases
  describe('modifyPassword', () => {
    it('[200] 비밀번호 수정 성공', async () => {
      const reqObj = {
        user: {
          id: 1,
          name: '홍길동',
          userId: 'honGil',
          email: 'dongil@dsm.hs.kr',
          number: 1111,
          password: 'th!i@Ist!@$2',
          isStudent: true,
        },
      };
      const header = {
        verifyToken: 'Bearer Ab35jck6h.doaek8wnkd.kjf57oejqon29',
      };

      const request = {
        newPassword: 'tHisIsnEwPassW0Rd!',
      };

      (PASSWORD_REGEXP.test as jest.Mock) = jest
        .fn()
        .mockImplementationOnce(() => true);
      jest.spyOn(jwt, 'decode').mockImplementationOnce(() => ({
        id: 1,
        iat: 12345678,
        exp: 87654321,
      }));
      jest.spyOn(Date, 'now').mockReturnValue(12345679);
      (prisma.updateUserPassword as jest.Mock) = jest.fn();

      await expect(
        await service.modifyPassword(header, request, reqObj),
      ).resolves.toStrictEqual(null);
    });

    it('[400] 비밀번호 규칙 위반', async () => {
      const reqObj = {
        user: {
          id: 1,
          name: '홍길동',
          userId: 'honGil',
          email: 'dongil@dsm.hs.kr',
          number: 1111,
          password: 'th!i@Ist!@$2',
          isStudent: true,
        },
      };
      const header = {
        verifyToken: 'Bearer Ab35jck6h.doaek8wnkd.kjf57oejqon29',
      };

      const request = {
        newPassword: 'helloiamlog',
      };

      (new RegExp(/^(?=.*[a-zA-Z])(?=.*[!\/@#$%^*+=-])(?=.*[0-9]).{8,15}$/g)
        .test as jest.Mock) = jest.fn().mockReturnValueOnce(false);

      await expect(
        async () => await service.modifyPassword(header, request, reqObj),
      ).rejects.toThrowError(new BadRequestException('비밀번호 제약조건 위반'));
    });

    it('[401] Unauthorized', async () => {
      const reqObj = {
        user: {
          id: 1,
          name: '홍길동',
          userId: 'honGil',
          email: 'dongil@dsm.hs.kr',
          number: 1111,
          password: 'th!i@Ist!@$2',
          isStudent: true,
        },
      };
      const header = {
        verifyToken: 'Bearer Ab35jck6h.doaek8wnkd.kjf57oejqon29',
      };

      const request = {
        newPassword: 'tHisIsnEwPassW0Rd!',
      };

      (PASSWORD_REGEXP.test as jest.Mock) = jest.fn().mockReturnValueOnce(true);
      (compare as jest.Mock) = jest.fn(() => true);
      jest.spyOn(Date, 'now').mockReturnValue(12345679);

      await expect(
        async () => await service.modifyPassword(header, request, reqObj),
      ).rejects.toThrowError(new UnauthorizedException());
    });

    it('[409] Conflict', async () => {
      const reqObj = {
        user: {
          id: 1,
          name: '홍길동',
          userId: 'honGil',
          email: 'dongil@dsm.hs.kr',
          number: 1111,
          password: 'th!i@Ist!@$2',
          isStudent: true,
        },
      };
      const header = {
        verifyToken: 'Bearer Ab35jck6h.doaek8wnkd.kjf57oejqon29',
      };

      const request = {
        newPassword: 'tHisIsnEwPassW0Rd!',
      };

      (new RegExp(/^(?=.*[a-zA-Z])(?=.*[!\/@#$%^*+=-])(?=.*[0-9]).{8,15}$/g)
        .test as jest.Mock) = jest.fn().mockReturnValueOnce(true);
      reqObj.user.password = 'th!i@Ist!@$2';
      (compare as jest.Mock) = jest.fn(() => true);

      await expect(
        async () => await service.modifyPassword(header, request, reqObj),
      ).rejects.toThrowError(new ConflictException('기존 비밀번호와 동일'));
    });

    it('[500] Internal Server Error Exception', async () => {
      const reqObj = {
        user: {
          id: 1,
          name: '홍길동',
          userId: 'honGil',
          email: 'dongil@dsm.hs.kr',
          number: 1111,
          password: 'th!i@Ist!@$2',
          isStudent: true,
        },
      };
      const header = {
        verifyToken: 'Bearer Ab35jck6h.doaek8wnkd.kjf57oejqon29',
      };

      const request = {
        newPassword: 'tHisIsnEwPassW0Rd!',
      };

      (PASSWORD_REGEXP.test as jest.Mock) = jest.fn().mockReturnValue(true);
      (compare as jest.Mock) = jest.fn(() => true);
      jest.spyOn(Date, 'now').mockReturnValue(12345679);
      (prisma.updateUserPassword as jest.Mock) = jest.fn(async () => {
        throw new InternalServerErrorException('DB 오류');
      });

      await expect(
        async () => await service.modifyPassword(header, request, reqObj),
      ).rejects.toThrowError(new InternalServerErrorException('DB 오류'));
    });
  });
  */
});
