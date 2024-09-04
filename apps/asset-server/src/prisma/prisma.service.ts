import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CATEGORY, CONTEST_STATUS, PrismaClient, Projects } from "./client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
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

  async findPagedProjectByContestId(contestId: string, page: number) {
    return await this.projects.findMany({
      where: { contest_id: contestId },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * 12,
      take: 12,
    });
  }

  async findAllLikeByProjectId(projectId: string) {
    return await this.like.findMany({
      where: { project_id: projectId },
      select: { user_id: true },
    });
  }

  async findOneProjectByProjectId(id: string) {
    return await this.projects.findUnique({ where: { id } });
  }

  async findOneContestNameAndIdByContestId(id: string) {
    return await this.contests.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAllProjectsContainsKeyword(keyword: string, page: number) {
    return await this.projects.findMany({
      where: { name: { contains: keyword, mode: "insensitive" } },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * 12,
      take: 12,
    });
  }

  async saveProject(
    project: {
      name: string;
      image: string;
      members: string[];
      skills: string[];
      auth_category: CATEGORY;
      introduction: string;
      description: string;
      video_link: string;
    },
    contest_id: string,
  ): Promise<Projects> {
    try {
      return await this.projects.create({
        data: {
          ...project,
          contest: {
            connect: { id: contest_id },
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async existByUserIdAndContestId(userId: string, contestId: string) {
    const projectCnt = await this.projects.findFirst({
      where: {
        members: {
          has: userId,
        },
        contest_id: contestId,
      },
    });

    return Boolean(projectCnt);
  }

  async saveVote(user_id: string, contest_id: string, project_id: string) {
    try {
      await this.vote.create({
        data: {
          user_id,
          contest_id,
          project_id,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async updateVote(user_id: string, project_id: string) {
    const thisVote = await this.vote.findUnique({
      where: { project_id_user_id: { project_id, user_id } },
    });

    if (thisVote) throw new ConflictException("해당 대회에 투표하지 않았음");

    try {
      await this.vote.update({
        where: {
          project_id_user_id: {
            project_id,
            user_id,
          },
        },
        data: { project_id },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async existContestByContestId(id: string) {
    const contest = await this.contests.findUnique({ where: { id } });

    return Boolean(contest);
  }

  async existVoteByContestIdAndUserId(project_id: string, user_id: string) {
    const contest = await this.vote.findUnique({
      where: { project_id_user_id: { project_id, user_id } },
    });

    return Boolean(contest);
  }
}
