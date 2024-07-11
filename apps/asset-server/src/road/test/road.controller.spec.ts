import { Test, TestingModule } from "@nestjs/testing";
import { RoadController } from "../road.controller";
import { RoadService } from "../road.service";
import { CATEGORY } from "@prisma/client";

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

    const result = await controller.mainpage({});

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
});
