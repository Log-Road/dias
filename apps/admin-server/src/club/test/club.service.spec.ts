import { Test, TestingModule } from "@nestjs/testing";
import { ClubService } from "../club.service";
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { PostClubRequestDto } from "../dto/req/postClub.request.dto";
import { GetClubRequestDto } from "../dto/req/getClub.request.dto";

describe("ClubService", () => {
  let service: ClubService;
  let prisma: PrismaService;
  let userPrisma: UserPrismaService;

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
    findClubs: jest.fn(async () => {
      return [
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
      ];
    }),
  };
  const userPrismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubService,
        Logger,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: UserPrismaService,
          useValue: userPrismaMock,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ClubService>(ClubService);

    prismaMock.saveClub.mockClear();
    prismaMock.findClubByName.mockClear();
  });

  describe("PostClub", () => {
    const request: PostClubRequestDto = {
      is_active: true,
      club_name: "Log",
    };

    it("[201]", async () => {
      const res = await service.postClub(request);
      expect(prismaMock.saveClub).toHaveBeenCalledTimes(1);
      expect(prismaMock.saveClub).toHaveBeenCalledWith(
        request.club_name,
        request.is_active,
      );
      expect(res).toEqual({
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
      });
    });

    it("[409]", async () => {
      clubDatabase["Log"] = true;

      await expect(async () => {
        await service.postClub(request);
      }).rejects.toThrow(new ConflictException());

      delete clubDatabase["Log"];
    });

    it("[500]", async () => {
      prismaMock.saveClub.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      await expect(async () => {
        await service.postClub(request);
      }).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe("GetClub", () => {
    // No-404 : This API get a LIST of clubs
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
      const res = await service.getClub(request);

      expect(prismaMock.findClubs).toHaveBeenCalledTimes(1);
      expect(prismaMock.findClubs).toHaveBeenCalledWith();
      expect(res).toEqual({
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
      });
    });

    it("[500]", async () => {
      prismaMock.findClubs.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      await expect(async () => {
        await service.getClub(request);
      }).rejects.toThrow(new InternalServerErrorException());
    });
  });

  // describe("PatchClub", () => {
  //   // 200, 400, 404, 409, 500
  //   it("[200]", () => {});

  //   it("[400]", () => {});

  //   it("[404]", () => {});

  //   it("[409]", () => {});

  //   it("[500]", () => {});
  // });

  // describe("DeleteClub", () => {
  //   // 200, 400, 404, 409, 500
  //   it("[200]", () => {});

  //   it("[400]", () => {});

  //   it("[404]", () => {});

  //   it("[409]", () => {});

  //   it("[500]", () => {});
  // });
});
