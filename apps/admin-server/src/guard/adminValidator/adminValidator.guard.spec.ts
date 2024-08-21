import { Test, TestingModule } from "@nestjs/testing";
import { AdminValidateGuard } from "./adminValidator.guard";
import { JwtAuthGuard } from "../../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { ROLE } from "../../../../dias/src/prisma/client";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

describe("AdminValidatorGuard", () => {
  let guard: AdminValidateGuard;

  const authorization = configService.get<string>("TESTING_TOKEN")
  const password = configService.get<string>("TESTING_PASSWORD")

  const jwtGuardMock = {
    canActivate: jest.fn(async (context: ExecutionContext) => {
      return true;
    }),
  };
  const userPrismaMock = {
    findUserByStrId: (userId: string) => {
      console.log(userId, "findUserByStrId");
      return true;
    },
    findUserById: (id: string) => {
      console.log(id, "findUserById");
      return true;
    },
    findUserByNumber: (number?: number) => {
      console.log(number, "findUserByNumber");
      return true;
    },
  };

  let userDatabase = [];

  let req: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: jwtGuardMock,
        },
      ],
    }).compile();

    guard = new AdminValidateGuard(jwtGuardMock as unknown as JwtAuthGuard);

    userDatabase = [
      {
        id: "07b2462a-8117-4d44-88ec-a7de328d9ca1",
        string_id: "admin",
        name: "admin",
        email: "zxcv@asdf.qwer",
        password,
        role: ROLE.Admin,
        account_provided: "local",
      },
      {
        id: "07b2463a-8117-4d44-88ec-a7de328d9ca1",
        string_id: "student",
        name: "student",
        email: "qwer@asdf.zxcv",
        password,
        role: ROLE.Student,
        student_number: "1234",
        account_provided: "local",
      },
      {
        id: "07b2464a-8117-4d44-88ec-a7de328d9ca1",
        string_id: "teacher",
        name: "teacher",
        email: "asdf@qwer.zxcv",
        password,
        role: ROLE.Teacher,
        account_provided: "local",
      },
    ];

    jwtGuardMock.canActivate.mockClear();
  });

  describe("canActivate", () => {
    it("[200]", async () => {
      req = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ["headers"]: {
              host: "localhost:8080",
              "content-type": "application/json",
              "user-agent": "insomnia/8.6.1",
              authorization,
              accept: "*/*",
              "content-length": "45",
            },
            ["body"]: {
              user: {
                id: "07b2462a-8117-4d44-88ec-a7de328d9ca1",
                string_id: "admin",
                name: "admin",
                email: "zxcv@asdf.qwer",
                password:
                  "$2b$10$J/nx4iLm.pFujphaz0bOn.9jOkDymdLHjJUN/B6ic820BJVyJuu1e",
                role: "Admin",
                account_provided: "local",
              },
            },
          }),
          getResponse: jest.fn(),
        }),
      };

      const res = await guard.canActivate(req as ExecutionContext);

      expect(jwtGuardMock.canActivate).toHaveBeenCalledTimes(1);
      expect(jwtGuardMock.canActivate).toHaveBeenCalledWith(req);
      expect(res).toEqual(true);
    });

    it("[401] (1) 토큰 형식 오류", async () => {
      const authorization = "aheijka.dl.2kiodhjoal"

      req = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ["headers"]: {
              host: "localhost:8080",
              "content-type": "application/json",
              "user-agent": "insomnia/8.6.1",
              authorization,
              accept: "*/*",
              "content-length": "45",
            },
            ["body"]: {},
          }),
          getResponse: jest.fn(),
        }),
      };
      jwtGuardMock.canActivate.mockImplementation(async () => false);

      await expect(
        async () => await guard.canActivate(req as ExecutionContext),
      ).rejects.toThrow(new UnauthorizedException("토큰 형식 오류"));
    });

    it("[401] (2) 잘못된 토큰", async () => {
      const authorization = "aheijka.dl.2kiodhjoal"

      req = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ["headers"]: {
              host: "localhost:8080",
              "content-type": "application/json",
              "user-agent": "insomnia/8.6.1",
              authorization,
              accept: "*/*",
              "content-length": "45",
            },
            ["body"]: {},
          }),
          getResponse: jest.fn(),
        }),
      };
      jwtGuardMock.canActivate.mockImplementation(async () => false);

      await expect(
        async () => await guard.canActivate(req as ExecutionContext),
      ).rejects.toThrow(new UnauthorizedException("토큰 형식 오류"));
    });

    it("[403] (1) Student", async () => {
      req = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ["headers"]: {
              host: "localhost:8080",
              "content-type": "application/json",
              "user-agent": "insomnia/8.6.1",
              authorization,
              accept: "*/*",
              "content-length": "45",
            },
            ["body"]: {
              user: {
                id: "07b2463a-8117-4d44-88ec-a7de328d9ca1",
                string_id: "student",
                name: "student",
                email: "qwer@asdf.zxcv",
                password:
                  "$2b$10$J/nx4iLm.pFujphaz0bOn.9jOkDymdLHjJUN/B6ic820BJVyJuu1e",
                role: ROLE.Student,
                student_number: "1234",
                account_provided: "local",
              },
            },
          }),
          getResponse: jest.fn(),
        }),
      };

      await expect(
        async () => await guard.canActivate(req as ExecutionContext),
      ).rejects.toThrow(new ForbiddenException());
    });

    it("[403] (2) Teacher", async () => {
      req = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ["headers"]: {
              host: "localhost:8080",
              "content-type": "application/json",
              "user-agent": "insomnia/8.6.1",
              authorization,
              accept: "*/*",
              "content-length": "45",
            },
            ["body"]: {
              user: {
                id: "07b2464a-8117-4d44-88ec-a7de328d9ca1",
                string_id: "teacher",
                name: "teacher",
                email: "asdf@qwer.zxcv",
                password:
                  "$2b$10$J/nx4iLm.pFujphaz0bOn.9jOkDymdLHjJUN/B6ic820BJVyJuu1e",
                role: "Teacher",
                account_provided: "local",
              },
            },
          }),
          getResponse: jest.fn(),
        }),
      };

      await expect(
        async () => await guard.canActivate(req as ExecutionContext),
      ).rejects.toThrow(new ForbiddenException());
    });
  });
});
