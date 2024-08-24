import { Test, TestingModule } from "@nestjs/testing";
import { CompetitionService } from "../competition.service";
import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PostCompetitionRequestDto } from "../dto/request/postCompetition.request.dto";
import { PostAwardsRequestDto } from "../dto/request/postAwards.request.dto";
import { COMPETITION_STATUS } from "../../prisma/client";

describe("CompetitionService", () => {
  let service: CompetitionService;

  let competitionDatabase: {
    [key: string]: {
      id: number;
      name: string;
      start_date: Date;
      end_date: Date;
      purpose: string;
      audience: string;
      place: string;
      status: COMPETITION_STATUS;
    };
  } = {};
  let awardDatabase: {
    [key: string]: {
      id: number;
      contestId: string;
      count: number;
      name: string;
    };
  } = {};
  let winnerDatabase: {
    [key: string]: {
      id: number;
      contestId: string;
      awardId: string;
      userId: string;
    };
  } = {};

  const prismaMock = {
    saveCompetition: jest.fn(
      async (competition: {
        name: string;
        start_date: Date;
        end_date: Date;
        purpose: string;
        audience: string;
        place: string;
        status: COMPETITION_STATUS;
      }) => {
        const id = Object.keys(competitionDatabase).length;
        competitionDatabase[id] = Object.assign({ id }, competition);
        return competitionDatabase[id];
      },
    ),
    saveAwards: jest.fn(
      async (awards: { contestId: string; count: number; name: string }) => {
        const id = Object.keys(awardDatabase).length;
        awardDatabase[id] = Object.assign({ id }, awards);
        return awardDatabase[id];
      },
    ),
    saveWinner: jest.fn(
      async (
        contestId: string,
        winner: { awardId: string; userId: string },
      ) => {
        const { awardId, userId } = winner;
        const id = Object.keys(winnerDatabase).length;
        winnerDatabase[id] = { id, userId, awardId, contestId };
      },
    ),
    findCompetitionById: jest.fn(async (id: string) => {
      return competitionDatabase[id];
    }),
    findCompetitionList: jest.fn(async (page: number) => {
      return Object.values(competitionDatabase).slice(page, page + 15);
    }),
  };
  const userPrismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UserPrismaService, useValue: userPrismaMock },
        JwtService,
        Logger,
      ],
    }).compile();

    service = module.get<CompetitionService>(CompetitionService);

    competitionDatabase = {};
    awardDatabase = {};
    winnerDatabase = {};

    prismaMock.saveCompetition.mockClear();
    prismaMock.saveAwards.mockClear();
    prismaMock.saveWinner.mockClear();
    prismaMock.findCompetitionById.mockClear();
    prismaMock.findCompetitionList.mockClear();
  });

  describe("PostCompetition", () => {
    const request: PostCompetitionRequestDto = {
      name: "test",
      startDate: "2024-08-19T00:00:00Z",
      endDate: "2024-08-21T23:59:59Z",
      purpose: "학생들의 협업 능력 향상 및 코드 검수 정도 확인",
      audience: "대덕소프트웨어마이스터고등학교 2학년",
      place: "청죽관",
      awards: [
        {
          count: 1,
          name: "금상",
        },
        {
          count: 2,
          name: "은상",
        },
        {
          count: 4,
          name: "동상",
        },
      ],
    };

    it("[201]", async () => {
      const { awards, ...competition } = request;
      const res = await service.postCompetition(request);

      expect(prismaMock.saveCompetition).toHaveBeenCalledTimes(1);
      expect(prismaMock.saveAwards).toHaveBeenCalledTimes(3);
      expect(prismaMock.saveCompetition).toHaveBeenCalledWith(competition);
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(
        1,
        Object.assign(awards[0], { contestId: 0 }),
      );
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(
        2,
        Object.assign(awards[1], { contestId: 0 }),
      );
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(
        3,
        Object.assign(awards[2], { contestId: 0 }),
      );
      expect(res).toEqual({ id: 0 });
    });
  });

  describe("PostAwards", () => {
    const request: PostAwardsRequestDto = {
      list: [
        {
          awardId: "1",
          userId: ["1"],
        },
        {
          awardId: "2",
          userId: ["2", "3"],
        },
        {
          awardId: "3",
          userId: ["4", "5", "6"],
        },
      ],
    };

    it("[201]", async () => {
      competitionDatabase["1"] = {
        id: 1,
        name: "test",
        start_date: new Date("2024-08-19T00:00:00Z"),
        end_date: new Date("2024-08-21T23:59:59Z"),
        purpose: "학생들의 협업 능력 향상 및 코드 검수 정도 확인",
        audience: "대덕소프트웨어마이스터고등학교 2학년",
        place: "청죽관",
        status: "ONGOING",
      };

      awardDatabase["1"] = {
        id: 1,
        contestId: "1",
        count: 1,
        name: "금상",
      };

      awardDatabase["2"] = {
        id: 2,
        contestId: "1",
        count: 2,
        name: "은상",
      };

      awardDatabase["3"] = {
        id: 3,
        contestId: "1",
        count: 3,
        name: "동상",
      };

      const res = await service.postAwards("1", request);

      expect(prismaMock.saveWinner).toHaveBeenCalledTimes(6);
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(1, "1", {
        awardId: "1",
        userId: "1",
      });
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(2, "1", {
        awardId: "2",
        userId: "2",
      });
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(3, "1", {
        awardId: "2",
        userId: "3",
      });
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(4, "1", {
        awardId: "3",
        userId: "4",
      });
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(5, "1", {
        awardId: "3",
        userId: "5",
      });
      expect(prismaMock.saveWinner).toHaveBeenNthCalledWith(6, "1", {
        awardId: "3",
        userId: "6",
      });
      expect(res).toEqual({});
    });

    it("[404]", async () => {
      prismaMock.findCompetitionById.mockImplementation(() => undefined);
      expect(
        async () => await service.postAwards("1", request),
      ).rejects.toThrow(new NotFoundException());
      expect(prismaMock.findCompetitionById).toHaveBeenCalledTimes(1);
      expect(prismaMock.findCompetitionById).toHaveBeenCalledWith("1");
    });
  });

  describe("GetCompetitionList", () => {
    const page: string = "0";

    it("[200]", async () => {
      competitionDatabase = {
        "0": {
          id: 0,
          name: "test",
          start_date: new Date("2024-08-19T00:00:00Z"),
          end_date: new Date("2024-08-21T23:59:59Z"),
          purpose: "학생들의 협업 능력 향상 및 코드 검수 정도 확인",
          audience: "대덕소프트웨어마이스터고등학교 2학년",
          place: "청죽관",
          status: "ONGOING",
        },
        "1": {
          id: 1,
          name: "test",
          start_date: new Date("2024-08-19T00:00:00Z"),
          end_date: new Date("2024-08-21T23:59:59Z"),
          purpose: "학생들의 협업 능력 향상 및 코드 검수 정도 확인",
          audience: "대덕소프트웨어마이스터고등학교 2학년",
          place: "청죽관",
          status: "IN_PROGRESS",
        },
      };

      const res = await service.getCompetitionList(page);

      expect(prismaMock.findCompetitionList).toHaveBeenCalledTimes(1);
      expect(prismaMock.findCompetitionList).toHaveBeenCalledWith(Number(page));
      expect(res).toEqual({
        list: [
          {
            id: 0,
            name: "test",
            startDate: "2024-08-19T00:00:00.000Z",
            endDate: "2024-08-21T23:59:59.000Z",
            status: "ONGOING",
          },
          {
            id: 1,
            name: "test",
            startDate: "2024-08-19T00:00:00.000Z",
            endDate: "2024-08-21T23:59:59.000Z",
            status: "IN_PROGRESS",
          },
        ],
      });
    });

    it("[404]", async () => {
      await expect(async () => {
        await service.getCompetitionList(page);
      }).rejects.toThrow(new NotFoundException());

      expect(prismaMock.findCompetitionList).toHaveBeenCalledTimes(1);
      expect(prismaMock.findCompetitionList).toHaveBeenCalledWith(Number(page));
    });

    it("[500]", async () => {
      prismaMock.findCompetitionList.mockImplementation(() => {
        throw new InternalServerErrorException();
      })

      await expect(async() => {
        await service.getCompetitionList(page);
      }).rejects.toThrow(new InternalServerErrorException());

      expect(prismaMock.findCompetitionList).toHaveBeenCalledTimes(1);
      expect(prismaMock.findCompetitionList).toHaveBeenCalledWith(Number(page));
    })
  });
});
