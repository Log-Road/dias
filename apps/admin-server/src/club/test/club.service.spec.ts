import { Test, TestingModule } from "@nestjs/testing";
import { ClubService } from "../club.service";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

describe("ClubService", () => {
  let service: ClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubService,
        Logger,
        PrismaService,
        UserPrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ClubService>(ClubService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
