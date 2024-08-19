import { Test, TestingModule } from "@nestjs/testing";
import { ClubService } from "../club.service";
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { PostClubRequestDto } from "../dto/req/postClub.request.dto";
import { GetClubRequestDto } from "../dto/req/getClub.request.dto";
import { ModifyClubRequestDtoParams } from "../dto/req/modifyClub.request.dto";
import { DeleteClubRequestDtoParams } from "../dto/req/deleteClub.request.dto";

describe("ClubService", () => {
  let service: ClubService;
  let prisma: PrismaService;
  let userPrisma: UserPrismaService;

  let clubDatabase = {};
  let userDatabase = {};

  const prismaMock = {
    saveClub: jest.fn(async (clubName: string, isActive?: boolean) => {
      clubDatabase[clubName] = isActive ?? true;
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
      };
    }),
    findClub: jest.fn(async (clubId: string) => {
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
        club_name: "Log",
        is_active: true,
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
    patchClubStatus: jest.fn(async (clubId: string) => {
      return {
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
        club_name: "Log",
        is_active: false,
      };
    }),
    deleteClub: jest.fn(async (clubId: string) => {
      delete clubDatabase["Log"];
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
    prismaMock.findClub.mockClear();
    prismaMock.findClubByName.mockClear();
    prismaMock.findClubs.mockClear();
    prismaMock.patchClubStatus.mockClear();
    prismaMock.deleteClub.mockClear();

    clubDatabase = {};
    userDatabase = {};
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

  describe("ModifyClub", () => {
    clubDatabase["Log"] = true;
    const request: ModifyClubRequestDtoParams = {
      clubId: "a0a66122-d17c-4768-aaef-5e566e93606a",
    };

    it("[200]", async () => {
      prismaMock.findClub.mockImplementation(async (clubId: string) => {
        return {
          club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
          club_name: "Log",
          is_active: false,
        };
      });
      const res = await service.modifyClub(request);

      expect(prismaMock.patchClubStatus).toHaveBeenCalledTimes(1);
      expect(prismaMock.findClub).toHaveBeenCalledTimes(2);
      expect(res).toEqual({
        club_id: "a0a66122-d17c-4768-aaef-5e566e93606a",
        club_name: "Log",
        is_active: false,
      });
    });

    it("[404]", async () => {
      prismaMock.findClub.mockImplementationOnce(null);

      await expect(async () => {
        await service.modifyClub(request);
      }).rejects.toThrow(new NotFoundException());
    });

    it("[500]", async () => {
      prismaMock.patchClubStatus.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      await expect(async () => {
        await service.modifyClub(request);
      }).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe("DeleteClub", () => {
    const request: DeleteClubRequestDtoParams = {
      clubId: "a0a66122-d17c-4768-aaef-5e566e93606a",
    };

    it("[204]", async () => {
      clubDatabase["Log"] = true;

      const res = await service.deleteClub(request);

      expect(prismaMock.findClub).toHaveBeenCalledTimes(1);
      expect(prismaMock.findClub).toHaveBeenCalledWith(request.clubId);
      expect(prismaMock.deleteClub).toHaveBeenCalledTimes(1);
      expect(prismaMock.deleteClub).toHaveBeenCalledWith(request.clubId);
      expect(res).toBeFalsy();
    });

    it("[404]", async () => {
      prismaMock.findClub.mockImplementation(null);

      await expect(async () => {
        await service.deleteClub(request);
      }).rejects.toThrow(new NotFoundException());
    });

    it("[500]", async () => {
      clubDatabase["Log"] = true;

      prismaMock.deleteClub.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      await expect(async () => {
        await service.deleteClub(request);
      }).rejects.toThrow(new NotFoundException());
    });
  });
});
