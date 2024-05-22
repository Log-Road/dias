import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { SESClient } from "@aws-sdk/client-ses";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    jest.doMock("prisma");
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        Logger,
        PrismaService,
        ConfigService,
        JwtService,
        SESClient,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe("signUp", () => {
    const response = {
      data: null,
      statusCode: 201,
      statusMsg: "OK",
    };

    it("[200] 학생 회원가입 성공", async () => {
      const signUp = jest.spyOn(service, "signUp").mockReturnValue(null);

      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      const data = await controller.signUp(request);

      await expect(signUp).toBeCalledTimes(1);
      await expect(data).toStrictEqual(response);
    });

    it("[200] 선생님 회원가입 성공", async () => {
      const signUp = jest.spyOn(service, "signUp").mockImplementation(null);

      const request = {
        name: "홍길동",
        userId: "honGil",
        email: "dongil@dsm.hs.kr",
        password: "thisIsTest1!",
        isStudent: false,
      };

      const data = await controller.signUp(request);

      expect(signUp).toBeCalledTimes(1);
      expect(data).toEqual(response);
    });

    it("[409] 이미 존재하는 학번", async () => {
      const signUp = jest.spyOn(service, "signUp");

      const request = {
        name: "홍길동",
        userId: "hogGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));
      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementationOnce(async () => null);
      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementationOnce(async () => null);

      await expect(
        async () => await controller.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 학번"));
    });

    it("[409] 이미 존재하는 아이디", async () => {
      const signUp = jest.spyOn(service, "signUp");
      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));
      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementationOnce(async () => null);
      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementationOnce(async () => null);

      const request = {
        name: "홍길동",
        userId: "hogGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      await expect(
        async () => await controller.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 Id"));
    });

    it("[409] 이미 존재하는 이메일 주소", async () => {
      const signUp = jest.spyOn(service, "signUp");
      jest
        .spyOn(prisma, "findUserByEmail")
        .mockImplementationOnce(async () => Object.assign(request, { id: 1 }));
      jest
        .spyOn(prisma, "findUserByNumber")
        .mockImplementationOnce(async () => null);
      jest
        .spyOn(prisma, "findUserByStrId")
        .mockImplementationOnce(async () => null);

      const request = {
        name: "홍길동",
        userId: "hogGil",
        email: "dongil@dsm.hs.kr",
        number: 1111,
        password: "thisIsTest1!",
        isStudent: true,
      };

      await expect(
        async () => await controller.signUp(request),
      ).rejects.toThrowError(new ConflictException("이미 존재하는 이메일"));
    });
  });

  describe("findId", () => {
    const request = {
      email: "donGil@dsm.hs.kr",
    };

    it("[200]", async () => {
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

      await expect(controller.findId(request)).resolves.toStrictEqual({
        data: "honGil",
        statusCode: 201,
        statusMsg: "OK",
      });
    });

    it("[404] 존재하지 않는 유저", async () => {
      jest.spyOn(prisma, "findUserByEmail").mockImplementationOnce(null);

      await expect(
        async () => await controller.findId(request),
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

      await expect(controller.findPassword(request)).resolves.toStrictEqual({
        data: {
          temporary: "Th^Isi@SS_Alt",
        },
        statusCode: 200,
        statusMsg: "OK",
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
      jest.spyOn(prisma, "updateUserPassword").mockImplementation(() => {
        throw new BadRequestException("비밀번호 수정 실패");
      });

      await expect(
        async () => await controller.findPassword(request),
      ).rejects.toThrowError(new BadRequestException("비밀번호 수정 실패"));
    });

    it("[404] 존재하지 않는 유저", async () => {
      jest.spyOn(prisma, "findUserByStrId").mockImplementation(null);
      jest.spyOn(prisma, "updateUserPassword").mockImplementation(null);

      await expect(
        async () => await controller.findPassword(request),
      ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    });
  });
});
