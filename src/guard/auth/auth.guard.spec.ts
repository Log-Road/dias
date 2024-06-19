import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import {
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

describe("TokenGuard - HTTP", () => {
  let guard: AuthGuard;
  let jwt: JwtService;
  let prisma: PrismaService;

  let req: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, ConfigService, PrismaService],
    }).compile();

    jwt = module.get<JwtService>(JwtService);
    prisma = module.get<PrismaService>(PrismaService);

    guard = new AuthGuard(jwt, prisma);

    req = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          ["headers"]: {
            host: "localhost:8080",
            "content-type": "application/json",
            "user-agent": "insomnia/8.6.1",
            authorization:
              "Bearer eyIkpXVCJ9.eyJpZCleHAiOjE3MTE2OTU1MzV9.T6obsq3dGrHHZ-SnjE6H50",
            accept: "*/*",
            "content-length": "45",
          },
          ["body"]: {},
        }),
        getResponse: jest.fn(),
      }),
    };
  });

  it("[200] success", async () => {
    jest.spyOn(jwt, "decode").mockImplementationOnce(() => ({
      id: 1,
      iat: "2024-03-05T13:32:58.842Z",
      exp: "2024-03-06T13:32:58.842Z",
    }));

    const find = jest.spyOn(prisma, "findUserById").mockImplementationOnce(
      async (id: number) =>
        await {
          id,
          name: "홍길동",
          userId: "honGil",
          email: "dongil@dsm.hs.kr",
          number: 1111,
          password: "thisIsTest1!",
          isStudent: true,
          provided: 'jwt'
        },
    );

    await expect(
      guard.canActivate(req as ExecutionContext),
    ).resolves.toStrictEqual(true);
    await expect(find).toBeCalledTimes(1);
  });

  it("[401] 토큰 미존재", async () => {
    req = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          ["headers"]: {
            host: "localhost:8080",
            "content-type": "application/json",
            "user-agent": "insomnia/8.6.1",
            authorization: null,
            accept: "*/*",
            "content-length": "45",
          },
        }),
        getResponse: jest.fn(),
      }),
    };

    await expect(
      async () => await guard.canActivate(req as ExecutionContext),
    ).rejects.toThrowError(new UnauthorizedException("토큰 필요"));
  });

  it("[401] 토큰 형식 오류", async () => {
    req = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          ["headers"]: {
            host: "localhost:8080",
            "content-type": "application/json",
            "user-agent": "insomnia/8.6.1",
            authorization:
              "eyIkpXVCJ9.eyJpZCleHAiOjE3MTE2OTU1MzV9.T6obsq3dGrHHZ-SnjE6H50",
            accept: "*/*",
            "content-length": "45",
          },
        }),
        getResponse: jest.fn(),
      }),
    };

    await expect(
      async () => await guard.canActivate(req as ExecutionContext),
    ).rejects.toThrowError(new UnauthorizedException("토큰 형식 오류"));
  });

  it("[404] 존재하지 않는 유저", async () => {
    jest.spyOn(jwt, "decode").mockImplementationOnce(() => ({
      id: 1,
      iat: "2024-03-05T13:32:58.842Z",
      exp: "2024-03-06T13:32:58.842Z",
    }));

    const find = jest
      .spyOn(prisma, "findUserById")
      .mockImplementationOnce(null);

    await expect(
      async () => await guard.canActivate(req as ExecutionContext),
    ).rejects.toThrowError(new NotFoundException("존재하지 않는 유저"));
    await expect(find).toBeCalledTimes(1);
  });
});
