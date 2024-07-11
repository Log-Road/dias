import { Test, TestingModule } from "@nestjs/testing";
import { RoadService } from "../road.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CATEGORY, STATUS } from "@prisma/client";

describe("RoadService", () => {
  let service: RoadService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadService,
        {
          provide: PrismaService,
          useValue: {
            findAllContests: jest.fn(),
            findContestByDateBefore: jest.fn(),
            findAllAwardsByContestId: jest.fn(),
            findAllProjects: jest.fn(),
            countLikesByProjectId: jest.fn(),
            findOneLikeByProjectIdAndUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoadService>(RoadService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("now object testing", async () => {
    const mockDate = new Date("2024-07-15");

    const contests = [
      {
        id: "1",
        name: "contest1",
        start_date: new Date("2024-07-10"),
        end_date: new Date("2024-07-20"),
      },
      {
        id: "2",
        name: "contest2",
        start_date: new Date("2024-07-15"),
        end_date: new Date("2024-07-20"),
      },
      {
        id: "3",
        name: "contest3",
        start_date: new Date("2024-07-01"),
        end_date: new Date("2024-07-10"),
      },
    ];

    const projects = [
      {
        id: "1",
        name: "project1",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        CreatedAt: new Date("2024-07-10"),
      },
      {
        id: "2",
        name: "project2",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        CreatedAt: new Date("2024-07-10"),
      },
    ];

    const awards = [
      { id: "1", name: "대상" },
      { id: "2", name: "원할머니밥상" },
      { id: "3", name: "크루와상" },
      { id: "4", name: "상상이상" },
    ];

    // 항상 일정한 결과가 나오도록 정해진 날짜로 고정
    jest.useFakeTimers().setSystemTime(mockDate);
    jest
      .spyOn(prismaService, "findAllContests")
      .mockReturnValue(Promise.resolve(contests));
    jest
      .spyOn(prismaService, "findContestByDateBefore")
      .mockReturnValue(Promise.resolve([contests[2]]));
    jest
      .spyOn(prismaService, "findAllAwardsByContestId")
      .mockReturnValue(Promise.resolve(awards));
    jest
      .spyOn(prismaService, "findAllProjects")
      .mockReturnValue(Promise.resolve(projects));
    jest
      .spyOn(prismaService, "countLikesByProjectId")
      .mockReturnValue(Promise.resolve(10));
    jest
      .spyOn(prismaService, "findOneLikeByProjectIdAndUserId")
      .mockReturnValue(Promise.resolve(null));

    const result = await service.mainpage({ user: null });

    expect(result).toEqual({
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
    });
  });
});
