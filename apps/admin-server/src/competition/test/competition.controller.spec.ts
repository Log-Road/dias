import { Test, TestingModule } from "@nestjs/testing";
import { CompetitionController } from "../competition.controller";
import { JwtService } from "@nestjs/jwt";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionService } from "../competition.service";
import { Logger } from "@nestjs/common";
import { PostCompetitionRequestDto } from "../dto/request/postCompetition.request.dto";

describe("CompetitionController", () => {
  let controller: CompetitionController;

  const prismaMock = {};
  const userPrismaMock = {};

  const serviceMock = {
    postCompetition: jest.fn(() => {
      return {
        id: 0,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionController],
      providers: [
        { provide: CompetitionService, useValue: serviceMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: UserPrismaService, useValue: userPrismaMock },
        JwtService,
        Logger,
      ],
    }).compile();

    controller = module.get<CompetitionController>(CompetitionController);
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
      const res = await controller.postCompetition(request);

      expect(serviceMock.postCompetition).toHaveBeenCalledTimes(1);
      expect(serviceMock.postCompetition).toHaveBeenCalledWith(request);
      expect(res).toEqual({ data: { id: 0 }, statusCode: 201, statusMsg: "" });
    });
  });
});
