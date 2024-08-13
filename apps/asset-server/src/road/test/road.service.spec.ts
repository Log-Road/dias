import { Test, TestingModule } from "@nestjs/testing";
import { RoadService } from "../road.service";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CATEGORY,
  Contests,
  PROJECT_STATUS,
  Projects,
} from "../../prisma/client";
import { ROLE } from "../../../../dias/src/prisma/client";
import { jest } from "@jest/globals";
import { GetProjectResponseDto } from "../dto/response/getProject.response.dto";

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
            findContestsOnGoing: jest.fn(),
            findAllProjectByContestId: jest.fn(),
            findAllLikeByProjectId: jest.fn(),
            findPagedProjectByContestId: jest.fn(),
            findOneProjectByProjectId: jest.fn(),
            findOneContestNameAndIdByContestId: jest.fn(),
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
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
      },
      {
        id: "2",
        name: "project2",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
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

  it("get contests test", async () => {
    const contests = [
      {
        id: "1",
        name: "2024 대마고 해커톤",
        start_date: new Date("2024-07-10"),
        end_date: new Date("2024-07-12"),
      },
      {
        id: "2",
        name: "2024년 7월 30일에 열리는 대회",
        start_date: new Date("2024-07-30"),
        end_date: new Date("2024-07-30"),
      },
      {
        id: "3",
        name: "2025 대마고 해커톤",
        start_date: new Date("2025-12-12"),
        end_date: new Date("2025-12-31"),
      },
    ];

    jest
      .spyOn(prismaService, "findContestsOnGoing")
      .mockReturnValue(Promise.resolve(contests));

    const result = await service.getContests();

    expect(result).toEqual({
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
    });
  });

  it("get archive test", async () => {
    const contests = Promise.resolve([
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
        start_date: new Date("2023-07-01"),
        end_date: new Date("2023-07-10"),
      },
    ]);

    const projects: Promise<Projects[]> = Promise.resolve([
      {
        id: "1",
        name: "project1",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
      },
      {
        id: "2",
        name: "project2",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
      },
    ]);

    const likes: Promise<{ user_id: string }[]> = Promise.resolve([
      { user_id: "1" },
      { user_id: "4" },
      { user_id: "7" },
      { user_id: "8" },
    ]);

    jest.spyOn(prismaService, "findContestsOnGoing").mockReturnValue(contests);
    jest.spyOn(prismaService, "findAllLikeByProjectId").mockReturnValue(likes);
    jest
      .spyOn(prismaService, "findAllProjectByContestId")
      .mockReturnValue(projects);

    const result = await service.getArchive("1", {
      user: {
        id: "1",
        userId: "loginId",
        name: "오송주",
        email: "dhthdwn7920@gmail.com",
        password: "string",
        role: ROLE.Student,
        number: 2209,
        provided: "access_token",
      },
    });

    expect(result).toEqual({
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
          authorCategory: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project1",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: new Date("2024-07-10"),
          like: true,
          likeCount: 4,
        },
        {
          id: "2",
          image: "image1",
          authorCategory: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project2",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: new Date("2024-07-10"),
          like: true,
          likeCount: 4,
        },
      ],
    });
  });

  it("get compitition test", async () => {
    const projects: Promise<Projects[]> = Promise.resolve([
      {
        id: "1",
        name: "project1",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
      },
      {
        id: "2",
        name: "project2",
        contest_id: "1",
        image: "image1",
        members: ["홍길동", "김아무개", "성이름"],
        skills: ["Nest.js", "prisma", "React"],
        status: PROJECT_STATUS.APPROVAL,
        auth_category: CATEGORY.CLUB,
        introduction:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description:
          "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
        video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
        place: "대덕마이스터고",
        created_at: new Date("2024-07-10"),
      },
    ]);

    const likes: Promise<{ user_id: string }[]> = Promise.resolve([
      { user_id: "1" },
      { user_id: "4" },
      { user_id: "7" },
      { user_id: "8" },
    ]);

    jest
      .spyOn(prismaService, "findPagedProjectByContestId")
      .mockReturnValue(projects);
    jest.spyOn(prismaService, "findAllLikeByProjectId").mockReturnValue(likes);

    const result = await service.getCompetition("1", 1, {
      user: {
        id: "1",
        userId: "loginId",
        name: "오송주",
        email: "dhthdwn7920@gmail.com",
        password: "string",
        role: ROLE.Student,
        number: 2209,
        provided: "access_token",
      },
    });

    expect(result).toEqual({
      projects: [
        {
          id: "1",
          image: "image1",
          authorCategory: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project1",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: new Date("2024-07-10"),
          like: true,
          likeCount: 4,
        },
        {
          id: "2",
          image: "image1",
          authorCategory: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project2",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: new Date("2024-07-10"),
          like: true,
          likeCount: 4,
        },
      ],
    });
  });

  it("get project test", async () => {
    const project: Projects = {
      id: "1",
      name: "project1",
      contest_id: "1",
      image: "image1",
      members: ["홍길동", "김아무개", "성이름"],
      skills: ["Nest.js", "prisma", "React"],
      status: PROJECT_STATUS.APPROVAL,
      auth_category: CATEGORY.CLUB,
      introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description:
        "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
      video_link: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
      place: "대덕마이스터고",
      created_at: new Date("2024-07-10"),
    };

    const likes: { user_id: string }[] = [
      { user_id: "1" },
      { user_id: "4" },
      { user_id: "7" },
      { user_id: "8" },
    ];

    const contests: { id: string; name: string } = {
      id: "1",
      name: "2024 대마고 해커톤",
    };

    jest
      .spyOn(prismaService, "findOneProjectByProjectId")
      .mockReturnValue(Promise.resolve(project));
    jest
      .spyOn(prismaService, "findOneContestNameAndIdByContestId")
      .mockReturnValue(Promise.resolve(contests));
    jest
      .spyOn(prismaService, "findAllLikeByProjectId")
      .mockReturnValue(Promise.resolve(likes));

    const result: GetProjectResponseDto = await service.getProjectDetail(
      {
        user: {
          id: "1",
          userId: "loginId",
          name: "홍길동",
          email: "dhthdwn7920@gmail.com",
          password: "string",
          role: ROLE.Student,
          number: 2209,
          provided: "access_token",
        },
      },
      "1",
    );

    expect(result).toEqual({
      id: "1",
      contest: {
        id: "1",
        name: "2024 대마고 해커톤",
      },
      title: "project1",
      image: "image1",
      members: ["홍길동", "김아무개", "성이름"],
      skills: ["Nest.js", "prisma", "React"],
      isAssigned: PROJECT_STATUS.APPROVAL,
      authorCategory: CATEGORY.CLUB,
      inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      content:
        "descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription",
      videoLink: "https://www.youtube.com/watch?v=ufEgjQ_-rJ0",
      isAuthor: true,
      like: true,
      likeCount: 4,
    });
  });
});
