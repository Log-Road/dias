import { Test, TestingModule } from "@nestjs/testing";
import { RoadController } from "../road.controller";
import { RoadService } from "../road.service";
import { CATEGORY } from "../../prisma/client";
import { CompetitionResponseDto } from "../dto/response/competition/competition.response.dto";

describe("RoadController", () => {
  let controller: RoadController;
  let service: RoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoadController],
      providers: [
        {
          provide: RoadService,
          useValue: {
            mainpage: jest.fn(),
            getContests: jest.fn(),
            getArchive: jest.fn(),
            getCompetition: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoadController>(RoadController);
    service = module.get<RoadService>(RoadService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("[200] mainpage 반환", async () => {
    jest.spyOn(service, "mainpage").mockReturnValue(
      Promise.resolve({
        now: [
          {
            id: "1",
            name: "contest1",
            duration: [new Date("2024-07-10"), new Date("2024-07-20")],
          },
          {
            id: "2",
            name: "contest2",
            duration: [new Date("2024-07-15"), new Date("2024-07-20")],
          },
        ],
        recently: {
          id: "3",
          name: "contest3",
          award: [
            { id: "1", name: "대상" },
            { id: "2", name: "원할머니밥상" },
            { id: "3", name: "크루와상" },
            { id: "4", name: "상상이상" },
          ],
        },
        archive: [
          {
            id: "1",
            name: "contest1",
            duration: [new Date("2024-07-10"), new Date("2024-07-20")],
          },
          {
            id: "2",
            name: "contest2",
            duration: [new Date("2024-07-15"), new Date("2024-07-20")],
          },
          {
            id: "3",
            name: "contest3",
            duration: [new Date("2024-07-01"), new Date("2024-07-10")],
          },
        ],
        project: [
          {
            id: "1",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 10,
          },
          {
            id: "2",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project2",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 10,
          },
        ],
      }),
    );

    const result = await controller.mainpage({ user: null });

    expect(result).toEqual({
      statusCode: 200,
      statusMsg: "OK",
      data: {
        now: [
          {
            id: "1",
            name: "contest1",
            duration: [new Date("2024-07-10"), new Date("2024-07-20")],
          },
          {
            id: "2",
            name: "contest2",
            duration: [new Date("2024-07-15"), new Date("2024-07-20")],
          },
        ],
        recently: {
          id: "3",
          name: "contest3",
          award: [
            { id: "1", name: "대상" },
            { id: "2", name: "원할머니밥상" },
            { id: "3", name: "크루와상" },
            { id: "4", name: "상상이상" },
          ],
        },
        archive: [
          {
            id: "1",
            name: "contest1",
            duration: [new Date("2024-07-10"), new Date("2024-07-20")],
          },
          {
            id: "2",
            name: "contest2",
            duration: [new Date("2024-07-15"), new Date("2024-07-20")],
          },
          {
            id: "3",
            name: "contest3",
            duration: [new Date("2024-07-01"), new Date("2024-07-10")],
          },
        ],
        project: [
          {
            id: "1",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 10,
          },
          {
            id: "2",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project2",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 10,
          },
        ],
      },
    });
  });

  it("[200] 현재 진행중인 대회 반환", async () => {
    jest.spyOn(service, "getContests").mockReturnValue(
      Promise.resolve({
        now: [
          {
            id: "1",
            name: "2024 대마고 해커톤",
            duration: [new Date("2024-07-10"), new Date("2024-07-12")],
          },
          {
            id: "2",
            name: "2024년 7월 30일에 열리는 대회",
            duration: [new Date("2024-07-30"), new Date("2024-07-30")],
          },
          {
            id: "3",
            name: "2025 대마고 해커톤",
            duration: [new Date("2025-12-12"), new Date("2025-12-31")],
          },
        ],
      }),
    );

    const result = await controller.getContests();

    expect(result).toEqual({
      data: {
        now: [
          {
            id: "1",
            name: "2024 대마고 해커톤",
            duration: [new Date("2024-07-10"), new Date("2024-07-12")],
          },
          {
            id: "2",
            name: "2024년 7월 30일에 열리는 대회",
            duration: [new Date("2024-07-30"), new Date("2024-07-30")],
          },
          {
            id: "3",
            name: "2025 대마고 해커톤",
            duration: [new Date("2025-12-12"), new Date("2025-12-31")],
          },
        ],
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });

  it("[200] 아카이브 페이지 반환", async () => {
    jest.spyOn(service, "getArchive").mockReturnValue(
      Promise.resolve({
        competitions: {
          "2024": [
            {
              id: "1",
              name: "contest1",
              duration: [new Date("2024-07-10"), new Date("2024-07-20")],
            },
            {
              id: "2",
              name: "contest2",
              duration: [new Date("2024-07-15"), new Date("2024-07-20")],
            },
          ],
          "2023": [
            {
              id: "3",
              name: "contest3",
              duration: [new Date("2023-07-01"), new Date("2023-07-10")],
            },
          ],
        },
        id: "1",
        projects: [
          {
            id: "1",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
          {
            id: "2",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project2",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
        ],
      }),
    );

    const result = await controller.getArchive("1", null);

    expect(result).toEqual({
      data: {
        competitions: {
          "2024": [
            {
              id: "1",
              name: "contest1",
              duration: [new Date("2024-07-10"), new Date("2024-07-20")],
            },
            {
              id: "2",
              name: "contest2",
              duration: [new Date("2024-07-15"), new Date("2024-07-20")],
            },
          ],
          "2023": [
            {
              id: "3",
              name: "contest3",
              duration: [new Date("2023-07-01"), new Date("2023-07-10")],
            },
          ],
        },
        id: "1",
        projects: [
          {
            id: "1",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
          {
            id: "2",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project2",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
        ],
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });

  it("[200] 대회 프로젝트들 반환", async () => {
    const project: Promise<CompetitionResponseDto> = Promise.resolve({
      projects: [
        {
          id: "1",
          image: "image1",
          author_category: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project1",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          created_at: new Date("2024-07-10"),
          like: false,
          like_count: 4,
        },
        {
          id: "2",
          image: "image1",
          author_category: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project2",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          created_at: new Date("2024-07-10"),
          like: false,
          like_count: 4,
        },
      ],
    });

    jest.spyOn(service, "getCompetition").mockReturnValue(project);

    const result = await controller.getCompetition("1", "1", null);

    expect(result).toEqual({
      data: {
        projects: [
          {
            id: "1",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
          {
            id: "2",
            image: "image1",
            author_category: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project2",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            created_at: new Date("2024-07-10"),
            like: false,
            like_count: 4,
          },
        ],
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });
});
