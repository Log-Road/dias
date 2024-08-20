import { Test, TestingModule } from "@nestjs/testing";
import { PersonService } from "../person.service";
import { ConfigService } from "@nestjs/config";
import { Logger } from "winston";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";

describe("PersonService", () => {
  let service: PersonService;

  let database = {};
  let userDataBase = {};

  const prismaMock = {};
  const userPrismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
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

    service = module.get<PersonService>(PersonService);
  });

  describe("getPerson", () => {});

  describe("searchPerson", () => {});

  describe("individualPatchPerson", () => {});

  describe("patchPersonByDocument", () => {});

  describe("postPersonByDocument", () => {});
});
