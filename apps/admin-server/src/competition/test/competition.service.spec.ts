import { Test, TestingModule } from "@nestjs/testing";
import { CompetitionService } from "../competition.service";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PostCompetitionRequestDto } from "../dto/request/postCompetition.request.dto";

describe("CompetitionService", () => {
  let service: CompetitionService;

  let competitionDatabase: Object = {};
  let awardDatabase: Object = {};

  const prismaMock = {
    saveCompetition: jest.fn(
      async (competition: {
        name: string;
        startDate: string;
        endDate: string;
        purpose: string;
        audience: string;
        place: string;
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

    prismaMock.saveCompetition.mockClear();
    prismaMock.saveAwards.mockClear();
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
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(1, Object.assign(awards[0], { contestId: 0 }))
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(2, Object.assign(awards[1], { contestId: 0 }))
      expect(prismaMock.saveAwards).toHaveBeenNthCalledWith(3, Object.assign(awards[2], { contestId: 0 }))
      expect(res).toEqual({ id: 0 });
    });
  });
});
