import { Test, TestingModule } from "@nestjs/testing";
import { ClubController } from "../club.controller";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClubService } from "../club.service";
import { PostClubRequestDto } from "../dto/req/postClub.request.dto";
import { GetClubRequestDto } from "../dto/req/getClub.request.dto";
import { ModifyClubRequestDtoParams } from "../dto/req/modifyClub.request.dto";
import { DeleteClubRequestDtoParams } from "../dto/req/deleteClub.request.dto";
import { JwtAuthGuard } from "../../../../dias/src/auth/strategies/jwt/jwt.auth.guard";

describe("ClubController", () => {
  let controller: ClubController;

  const serviceMock = {
    postClub: jest.fn(async (req: PostClubRequestDto) => {
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
      };
    }),
    getClub: jest.fn(async (req: GetClubRequestDto) => {
      return {
        clubs: [
          {
            club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
            club_name: "Log",
            is_active: true,
          },
          {
            club_id: "c61f97ad-0fe0-444d-93b8-435f3e35f78d",
            club_name: "Road",
            is_active: false,
          },
        ],
      };
    }),
    modifyClub: jest.fn(async (req: ModifyClubRequestDtoParams) => {
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
        club_name: "Log",
        is_active: false,
      };
    }),
    deleteClub: jest.fn(async (req: DeleteClubRequestDtoParams) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [
        {
          provide: ClubService,
          useValue: serviceMock,
        },
        ConfigService,
        PrismaService,
        UserPrismaService,
        JwtService,
        Logger,
        JwtAuthGuard
      ],
    }).compile();

    controller = module.get<ClubController>(ClubController);
  });

  describe("PostClub", () => {
    const request: PostClubRequestDto = {
      club_name: "Log",
      is_active: true,
    };

    it("[201]", async () => {
      const res = await controller.postClub(request);

      expect(serviceMock.postClub).toHaveBeenCalledTimes(1);
      expect(serviceMock.postClub).toHaveBeenCalledWith(request);
      expect(res).toEqual({
        data: {
          club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
        },
        statusCode: 201,
        statusMsg: "",
      });
    });
  });

  describe("GetClub", () => {
    const request: GetClubRequestDto = {
      user: {
        id: "bd312ed6-b688-4477-8c33-28152f225231",
        userId: "iixanx",
        name: "Yu Nahyun",
        email: "log-road@dsm.hs.kr",
        number: 3224,
        password: "dkjqo2jokdn92",
        provided: "local",
        role: "Admin",
      },
    };

    it("[200]", async () => {
      const res = await controller.getClub(request);

      expect(serviceMock.getClub).toHaveBeenCalledTimes(1);
      expect(serviceMock.getClub).toHaveBeenCalledWith(request);
      expect(res).toEqual({
        data: {
          clubs: [
            {
              club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
              club_name: "Log",
              is_active: true,
            },
            {
              club_id: "c61f97ad-0fe0-444d-93b8-435f3e35f78d",
              club_name: "Road",
              is_active: false,
            },
          ],
        },
        statusCode: 200,
        statusMsg: "",
      });
    });
  });

  describe("ModifyClub", () => {
    const request: ModifyClubRequestDtoParams = {
      clubId: "a0a66122-d17c-4768-aaef-5e566e93606a",
    };

    it("[200]", async () => {
      const res = await controller.modifyClub(request);

      expect(serviceMock.modifyClub).toHaveBeenCalledTimes(1);
      expect(serviceMock.modifyClub).toHaveBeenCalledWith(request);
      expect(res).toEqual({
        data: {
          club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
          club_name: "Log",
          is_active: false,
        },
        statusCode: 200,
        statusMsg: "",
      });
    });
  });

  describe("DeleteClub", () => {
    const request: DeleteClubRequestDtoParams = {
      clubId: "a0a66122-d17c-4768-aaef-5e566e93606a",
    };

    it("[204]", async () => {
      const res = await controller.deleteClub(request);

      expect(serviceMock.deleteClub).toHaveBeenCalledTimes(1);
      expect(serviceMock.deleteClub).toHaveBeenCalledWith(request);
      expect(res).toEqual({
        data: undefined,
        statusCode: 204,
        statusMsg: "",
      });
    });
  });
});
