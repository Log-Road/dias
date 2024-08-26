import { Test, TestingModule } from "@nestjs/testing";
import { CompetitionController } from "../competition.controller";
import { JwtService } from "@nestjs/jwt";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionService } from "../competition.service";
import { BadRequestException, Logger } from "@nestjs/common";
import { PostCompetitionRequestDto } from "../dto/request/postCompetition.request.dto";
import { PostAwardsRequestDto } from "../dto/request/postAwards.request.dto";
import { COMPETITION_STATUS } from "../../prisma/client";
import { PatchCompetitionRequestDto } from "../dto/request/patchCompetition.request.dto";

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
    postAwards: jest.fn(() => {
      return {};
    }),
    getCompetitionList: jest.fn(() => {
      return {
        list: [
          {
            id: "aae60e9d7f20",
            status: "ONGOING",
            name: "test",
            startDate: "2024-08-19T00:00:00.000Z",
            endDate: "2024-08-21T23:59:59.000Z",
          },
        ],
      };
    }),
    getCompetition: jest.fn(() => {
      return {
        id: "1",
        name: "제 N회 고등학생 알고리즘 풀이 경진 대회",
        startDate: new Date("2024-08-16T00:00:00.000Z").toISOString(),
        endDate: new Date("2024-08-30T23:59:59.000Z").toISOString(),
        purpose:
          "문제 풀이 실력 향상 및 알고리즘을 효과적으로 알리는 등 어쩌구",
        audience: "대전 소재 고등학교 1 ~ 2학년에 재학중인 학생",
        place: "대덕소프트웨어마이스터고등학교",
        status: COMPETITION_STATUS.ONGOING,
      };
    }),
    patchCompetition: jest.fn(() => {
      return {
        id: "1",
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

    serviceMock.postCompetition.mockClear();
    serviceMock.postAwards.mockClear();
    serviceMock.getCompetitionList.mockClear();
    serviceMock.getCompetition.mockClear();
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

  describe("PostAwards", () => {
    const request: PostAwardsRequestDto = {
      list: [
        {
          awardId: "1",
          userId: ["1"],
        },
      ],
    };
    it("[201]", async () => {
      const res = await controller.postAwards("1", request);

      expect(serviceMock.postAwards).toHaveBeenCalledTimes(1);
      expect(serviceMock.postAwards).toHaveBeenCalledWith("1", request);
      expect(res).toEqual({
        data: {},
        statusCode: 201,
        statusMsg: "",
      });
    });
  });

  describe("GetCompeititionList", () => {
    it("[200]", async () => {
      const request = "1";
      const res = await controller.getCompetitionList(request);

      expect(res).toEqual({
        data: {
          list: [
            {
              id: "aae60e9d7f20",
              status: "ONGOING",
              name: "test",
              startDate: "2024-08-19T00:00:00.000Z",
              endDate: "2024-08-21T23:59:59.000Z",
            },
          ],
        },
        statusCode: 200,
        statusMsg: "",
      });
      expect(serviceMock.getCompetitionList).toHaveBeenCalledTimes(1);
      expect(serviceMock.getCompetitionList).toHaveBeenCalledWith(request);
    });

    it("[400] NaN", async () => {
      const request = "This is not a number";

      await expect(async () => {
        await controller.getCompetitionList(request);
      }).rejects.toThrow(new BadRequestException("Parameter have to valid"));
      expect(serviceMock.getCompetitionList).toHaveBeenCalledTimes(0);
    });

    it("[400] Negative", async () => {
      const request = "-1";

      await expect(async () => {
        await controller.getCompetitionList(request);
      }).rejects.toThrow(new BadRequestException("Parameter have to valid"));
      expect(serviceMock.getCompetitionList).toHaveBeenCalledTimes(0);
    });
  });

  describe("GetCompetition", () => {
    const request = "1";

    it("[200]", async () => {
      const res = await controller.getCompetition(request);

      expect(serviceMock.getCompetition).toHaveBeenCalledTimes(1);
      expect(serviceMock.getCompetition).toHaveBeenCalledWith(request);
      expect(res).toEqual({
        data: {
          id: "1",
          name: "제 N회 고등학생 알고리즘 풀이 경진 대회",
          startDate: new Date("2024-08-16T00:00:00.000Z").toISOString(),
          endDate: new Date("2024-08-30T23:59:59.000Z").toISOString(),
          purpose:
            "문제 풀이 실력 향상 및 알고리즘을 효과적으로 알리는 등 어쩌구",
          audience: "대전 소재 고등학교 1 ~ 2학년에 재학중인 학생",
          place: "대덕소프트웨어마이스터고등학교",
          status: COMPETITION_STATUS.ONGOING,
        },
        statusCode: 200,
        statusMsg: "",
      });
    });

    it("[400]", async () => {
      const request = "";

      await expect(
        async () => await controller.getCompetition(request),
      ).rejects.toThrow(
        new BadRequestException("Must included parameter as id"),
      );
      expect(serviceMock.getCompetition).toHaveBeenCalledTimes(0);
    });
  });

  describe("PatchCompetition", () => {
    const id = "1";
    const request: PatchCompetitionRequestDto = {
      name: "대덕소프트웨어마이스터고등학교 전국 중학생 알고리즘 대회",
      status: "ONGOING",
      startDate: "2024-08-27T00:00:00.000Z",
      endDate: "2024-08-30T23:59:59.000Z",
      purpose:
        "학생들의 알고리즘 풀이 능력 향상 및 중학생 대상으로 본교 홍보",
      audience: "전국 중학생 중 본 대회의 예선 통과자",
      place: "대덕소프트웨어마이스터고등학교 소프트웨어개발 1 ~ 3실",
    }
    it("[200] update all", async () => {
      const res = await controller.patchCompetition(id, request);
      expect(res).toEqual({
        data: {
          id: "1",
        },
        statusCode: 200,
        statusMsg: ""
      })
      expect(serviceMock.patchCompetition).toHaveBeenCalledTimes(1);
      expect(serviceMock.patchCompetition).toHaveBeenCalledWith(id, request);
    });
  });
});
