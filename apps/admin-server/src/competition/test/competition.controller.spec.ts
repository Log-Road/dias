import { Test, TestingModule } from "@nestjs/testing";
import { CompetitionController } from "../competition.controller";
import { JwtService } from "@nestjs/jwt";
import { PrismaService as UserPrismaService } from "../../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionService } from "../competition.service";
import { Logger } from "@nestjs/common";

describe("CompetitionController", () => {
  let controller: CompetitionController;

  const prismaMock = {};
  const userPrismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionController],
      providers: [
        CompetitionService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UserPrismaService, useValue: userPrismaMock },
        JwtService,
        Logger,
      ],
    }).compile();

    controller = module.get<CompetitionController>(CompetitionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
