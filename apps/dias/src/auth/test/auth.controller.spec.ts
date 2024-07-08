import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthUtil } from "../../utils/auth.util";
import SendEmail from "../../middleware/send-email";
import { SESClient } from "@aws-sdk/client-ses";
import { JwtStrategyService } from "../strategies/jwt/jwt.strategy.service";
import { GoogleStrategyService } from "../strategies/google/google.strategy.service";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;
  let jwt: JwtService;
  let prisma: PrismaService;
  let jwtStrategy: JwtStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        Logger,
        PrismaService,
        ConfigService,
        JwtService,
        AuthUtil,
        SendEmail,
        SESClient,
        JwtStrategyService,
        GoogleStrategyService
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtStrategy = module.get<JwtStrategyService>(JwtStrategyService);
  });

  describe("regenerate refreshtoken", () => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzExMzQwNzU5fQ.0UbgRd-ZxhNdAnFvVtatAiNpALsxEkf-vDTpy9zfNIQ";
    const expiredAt = "2024-03-25T03:25:59.238Z";
    const refreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY";

    it("[200] success", async () => {
      const request =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTM4MjA2OSwiZXhwIjoxNzEyNTkxNjY5fQ.8ggYTBXBtPqcfveXX4nVAHUJYzp0uaeyAKAoQxxqVUE";

      const response = {
        data: {
          accessToken,
          expiredAt,
          refreshToken,
        },
        statusCode: 200,
        statusMsg: "토큰 재생성",
      };

      jest.spyOn(jwtStrategy, "verifyToken").mockImplementation(
        async () =>
          await {
            accessToken,
            expiredAt,
            refreshToken,
          },
      );

      expect(controller.verifyToken(request)).resolves.toStrictEqual(response);
    });

    it("[404] 존재하지 않는 사용자 아이디", async () => {
      const request =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTM4MjA2OSwiZXhwIjoxNzEyNTkxNjY5fQ.8ggYTBXBtPqcfveXX4nVAHUJYzp0uaeyAKAoQxxqVUE";

      jest.spyOn(jwt, "verifyAsync").mockImplementation(
        async () =>
          await {
            id: 0,
            iat: 123879705,
            exp: 12389174979,
          },
      );

      jest.spyOn(prisma, "findUserById").mockImplementation(null);

      await expect(
        async () => await controller.verifyToken(request),
      ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    });

    it("[500] Internal Server Error - Bearer Token 양식 위반", async () => {
      const request =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTM4MjA2OSwiZXhwIjoxNzEyNTkxNjY5fQ.8ggYTBXBtPqcfveXX4nVAHUJYzp0uaeyAKAoQxxqVUE";

      await expect(
        async () => await controller.verifyToken(request),
      ).rejects.toThrowError(
        new InternalServerErrorException("jwt must be provided"),
      );
    });

    it("[500] Internal Server Error - Token 시간 만료", async () => {
      const request =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTM4MjA2OSwiZXhwIjoxNzEyNTkxNjY5fQ.8ggYTBXBtPqcfveXX4nVAHUJYzp0uaeyAKAoQxxqVUE";

      jest.spyOn(jwt, "verifyAsync").mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      await expect(
        async () => await controller.verifyToken(request),
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });
});
