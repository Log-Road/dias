import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONTEST_STATUS, PrismaClient } from "./client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get("POSTGRESQL_DB"),
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAllContests() {
    return await this.contests.findMany({
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
      },
      orderBy: { start_date: "desc" },
    });
  }

  async findContestByDateBefore(now: Date) {
    return await this.contests.findMany({
      where: {
        end_date: { lt: now },
      },
      orderBy: [{ end_date: "desc" }, { start_date: "desc" }],
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAllAwardsByContestId(contestId: string) {
    return await this.awards.findMany({
      where: { contest_id: contestId },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAllProjects() {
    return await this.projects.findMany();
  }

  async countLikesByProjectId(projectId: string) {
    return await this.like.count({
      where: { project_id: projectId },
    });
  }

  async findOneLikeByProjectIdAndUserId(projectId: string, userId: string) {
    return await this.like.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });
  }

  async findContestsOnGoing() {
    return await this.contests.findMany({
      where: {
        status: CONTEST_STATUS.NOW,
      },
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
      },
      orderBy: { start_date: "desc" },
    });
  }

  async findAllProjectByContestId(contestId: string) {
    return await this.projects.findMany({
      where: { contest_id: contestId },
      orderBy: { created_at: "desc" },
    });
  }

  async findAllLikeByProjectId(projectId: string) {
    return await this.like.findMany({
      where: { project_id: projectId },
      select: { user_id: true },
    });
  }
}
