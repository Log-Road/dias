import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthUtil } from "../../utils/auth.util";
import { SESClient } from "@aws-sdk/client-ses";
import SendEmail from "../../middleware/send-email";
import { JwtStrategyService } from "../strategies/jwt/jwt.strategy.service";
import { GoogleStrategyService } from "../strategies/google/google.strategy.service";
import { RedisModule, RedisService } from "@liaoliaots/nestjs-redis";

describe("AuthService", () => {
  let module: TestingModule;

  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let util: AuthUtil;
  let jwtStrategy: JwtStrategyService;
  let redisService: RedisService;

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzExMzQwNzU5fQ.0UbgRd-ZxhNdAnFvVtatAiNpALsxEkf-vDTpy9zfNIQ";
  const refreshToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMTMyNjM1OSwiZXhwIjoxNzEyNTM1OTU5fQ.AVfdnjbeZ-vErFwbxSMiT_lf7wZGKdMW72mo5GOAFHY";
  const expiredAt = "2024-03-25T03:25:59.238Z";

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        Logger,
        ConfigService,
        AuthUtil,
        JwtService,
        SESClient,
        SendEmail,
        JwtStrategyService,
        GoogleStrategyService,
      ],
      imports: [
        RedisModule.forRoot(
          {
            readyLog: true,
            config: {
              host: process.env.REDIS_HOST,
              port: Number(process.env.REDIS_PORT),
              password: process.env.REDIS_PASSWORD,
            },
          },
          true,
        ),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    util = module.get<AuthUtil>(AuthUtil);
    jwtStrategy = module.get<JwtStrategyService>(JwtStrategyService);
    redisService = module.get<RedisService>(RedisService);

    util.genAccessToken = jest.fn().mockImplementation(
      async () =>
        await {
          accessToken,
          expiredAt,
        },
    );
    util.genRefreshToken = jest.fn(util.genRefreshToken).mockImplementation(
      async () =>
        await {
          refreshToken,
        },
    );
  });

  afterAll(async () => {
    await redisService.getClient().quit();
    await module.close();
  });

  describe("regenerate refreshtoken", () => {
    it("[200] success", async () => {
      const request = `Bearer ${refreshToken}`;

      const response = {
        accessToken,
        expiredAt,
        refreshToken,
      };

      prisma.findUserById = jest.fn().mockImplementationOnce(
        async () =>
          await {
            id: 1,
            name: "홍길동",
            userId: "honGil",
            email: "dongil@dsm.hs.kr",
            number: 1111,
            isStudent: true,
          },
      );
      jwt.verifyAsync = jest.fn().mockReturnValueOnce({ id: 1 });

      await expect(jwtStrategy.verifyToken(request)).resolves.toStrictEqual(
        response,
      );
    });

    it("[404] 존재하지 않는 사용자 아이디", async () => {
      const request = `Bearer ${refreshToken}`;

      prisma.findUserById = jest.fn().mockReturnValueOnce(null);
      jwt.verifyAsync = jest.fn().mockReturnValueOnce({ id: 1 });

      await expect(
        async () => await jwtStrategy.verifyToken(request),
      ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    });

    it("[500] Internal Server Error - Bearer Token 양식 위반", async () => {
      const request = refreshToken;

      await expect(
        async () => await jwtStrategy.verifyToken(request),
      ).rejects.toThrowError(
        new InternalServerErrorException("jwt must be provided"),
      );
    });

    it("[500] Internal Server Error - Token 시간 만료", async () => {
      const request = `Bearer ${refreshToken}`;

      jest.spyOn(jwt, "verifyAsync").mockImplementation(async () => {
        throw new InternalServerErrorException();
      });

      await expect(
        async () => await jwtStrategy.verifyToken(request),
      ).rejects.toThrowError(new InternalServerErrorException());
    });
  });
});
