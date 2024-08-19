import { Test, TestingModule } from "@nestjs/testing";
import { ClubController } from "../club.controller";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { BadRequestException, ForbiddenException, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClubService } from "../club.service";
import { PostClubRequestDto } from "../dto/req/postClub.request.dto";

describe("ClubController", () => {
  let controller: ClubController;

  const clubDatabase = {};
  const userDatabase = {};

  const prismaMock = {
    saveClub: jest.fn(async (clubName: string, isActive?: boolean) => {
      clubDatabase[clubName] = isActive ?? true;
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
      };
    }),
    findClubByName: jest.fn(async (clubName: string) => {
      const isExist = clubDatabase[clubName];
      return isExist ?? null;
    }),
  };
  const userPrismaMock = {};

  const serviceMock = {
    postClub: jest.fn(async (req: PostClubRequestDto) => {
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
      };
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
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: UserPrismaService,
          useValue: userPrismaMock,
        },
        JwtService,
        Logger,
      ],
    }).compile();

    controller = module.get<ClubController>(ClubController);

    prismaMock.saveClub.mockClear();
    prismaMock.findClubByName.mockClear();
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

    // input validation test 어케하지

    // it("[400]", async () => {
    //   await expect(async () => {

    //   }).rejects.toThrow(new BadRequestException());
    // });

    // it("[401]", async () => {
    //   await expect(async () => {

    //   }).rejects.toThrow(new UnauthorizedException());
    // });

    // it("[403]", async () => {
    //   await expect(async () => {

    //   }).rejects.toThrow(new ForbiddenException());
    // });
  });
});
