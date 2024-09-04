import { Test, TestingModule } from "@nestjs/testing";
import { RoadController } from "../road.controller";
import { RoadService } from "../road.service";
import { CATEGORY, PROJECT_STATUS } from "../../prisma/client";
import { CompetitionResponseDto } from "../dto/response/competition/competition.response.dto";
import { GetProjectResponseDto } from "../dto/response/getProject.response.dto";
import { SearchResponseDto } from "../dto/response/search.response.dto";
import { ROLE } from "../../../../dias/src/prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

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
            getProjectDetail: jest.fn(),
            searchProject: jest.fn(),
            writeProject: jest.fn(),
            teacherVote: jest.fn(),
            updateTeacherVote: jest.fn(),
          },
        },
        JwtService,
        PrismaService,
        ConfigService,
        UserPrismaService,
        Logger,
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
            authorCategory: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            createdAt: new Date("2024-07-10"),
            like: false,
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
            like: false,
            likeCount: 4,
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
            authorCategory: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            createdAt: new Date("2024-07-10"),
            like: false,
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
            like: false,
            likeCount: 4,
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
          authorCategory: CATEGORY.CLUB,
          author: ["홍길동", "김아무개", "성이름"],
          title: "project1",
          inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: new Date("2024-07-10"),
          like: false,
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
          like: false,
          likeCount: 4,
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
            authorCategory: CATEGORY.CLUB,
            author: ["홍길동", "김아무개", "성이름"],
            title: "project1",
            inform: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            createdAt: new Date("2024-07-10"),
            like: false,
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
            like: false,
            likeCount: 4,
          },
        ],
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });

  it("[200] 프로젝트 상세페이지 반환", async () => {
    const data: Promise<GetProjectResponseDto> = Promise.resolve({
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
      isAuthor: false,
      like: false,
      likeCount: 4,
    });

    jest.spyOn(service, "getProjectDetail").mockReturnValue(data);

    const result = await controller.getProjectDetail(null, "1");

    expect(result).toEqual({
      data: {
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
        isAuthor: false,
        like: false,
        likeCount: 4,
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });

  it("[200] 프로젝트 검색", async () => {
    const data: Promise<SearchResponseDto> = Promise.resolve({
      result: [
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

    jest.spyOn(service, "searchProject").mockReturnValue(data);

    const result = await controller.searchProjects(null, 1, "project");

    expect(result).toEqual({
      data: {
        result: [
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
      },
      statusCode: 200,
      statusMsg: "OK",
    });
  });

  it("[201] 프젝 등록", async () => {
    const projectId: Promise<string> = Promise.resolve("1");

    jest.spyOn(service, "writeProject").mockReturnValue(projectId);

    const result = await controller.writeProject({
      id: "1",
      name: "ROAD",
      image: "img URL",
      auth_category: CATEGORY.TEAM,
      members: ["1", "2", "3"],
      skills: ["nestjs", "prisma"],
      introduction: "RoadProject",
      video_link: "vidioLink.com",
      description: "just description",
      user: {
        id: "1",
        userId: "songju",
        name: "오송주",
        email: "dhthdwn7920@gmail.com",
        password: "1000",
        role: ROLE.Student,
        number: 2209,
        provided: "jwt example",
      },
    });

    expect(result).toEqual({
      data: { id: "1" },
      statusMsg: "Created",
      statusCode: 201,
    });
  });

  it("[201] 투표 등록", async () => {
    const result = await controller.teacherVote("1", {
      vote: ["3", "12", "5"],
      user: {
        id: "1",
        userId: "songju",
        name: "오송주",
        email: "dhthdwn7920@gmail.com",
        password: "1000",
        role: ROLE.Student,
        number: 2209,
        provided: "jwt example",
      },
    });

    expect(result).toEqual({
      statusMsg: "Created",
      statusCode: 201,
    });
  });

  it("[200] 투표 수정", async () => {
    const result = await controller.updateTeacherVote("1", {
      vote: ["3", "12", "5"],
      user: {
        id: "1",
        userId: "songju",
        name: "오송주",
        email: "dhthdwn7920@gmail.com",
        password: "1000",
        role: ROLE.Student,
        number: 2209,
        provided: "jwt example",
      },
    });

    expect(result).toEqual({
      statusMsg: "Created",
      statusCode: 200,
    });
  });
});
