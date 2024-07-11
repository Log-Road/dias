import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NowAndArchiveItemDto } from "./dto/response/mainpage/nowAndArchiveItem.dto";
import { AwardItemDto } from "./dto/response/mainpage/awardItem.dto";
import { RecentlyItemDto } from "./dto/response/mainpage/recentlyItem.dto";

@Injectable()
export class RoadService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async mainpage(user?: any) {
    const nowDate = new Date();
    const contests = await this.prismaService.findAllContests();
    const projects = (await this.prismaService.findAllProjects()).slice(0, 9);

    // now 객체 - 현재 진행중인 프로젝트
    const now: NowAndArchiveItemDto[] = contests
      .filter((contest) => {
        return contest.end_date >= nowDate && contest.start_date <= nowDate;
      })
      .map((contest) => ({
        id: contest.id,
        name: contest.name,
        duration: [contest.start_date, contest.end_date],
      }));

    // recent 객체 - 최근 진행된 프로젝트
    const recentlyEndedContest = (
      await this.prismaService.findContestByDateBefore(nowDate)
    )[0];

    const awards: AwardItemDto[] =
      await this.prismaService.findAllAwardsByContestId(
        recentlyEndedContest.id,
      );

    const recently: RecentlyItemDto = {
      id: recentlyEndedContest.id,
      name: recentlyEndedContest.name,
      award: awards,
    };

    // archive 객체 - 진행됬던 프로젝트들
    const archive: NowAndArchiveItemDto[] = contests.map((contest) => ({
      id: contest.id,
      name: contest.name,
      duration: [contest.start_date, contest.end_date],
    }));

    // projects 객체 - 최근 8개개의 프로젝트 반환
    const projectItem = await Promise.all(
      projects.map(async (project) => {
        const likeCnt = await this.prismaService.countLikesByProjectId(
          project.id,
        );

        let like: boolean = false;
        if (user) {
          const likeData =
            await this.prismaService.findOneLikeByProjectIdAndUserId(
              project.id,
              user.id,
            );
          if (likeData) like = true;
        }

        return {
          id: project.id,
          image: project.image,
          author_category: project.auth_category,
          author: project.members,
          title: project.name,
          inform: project.introduction,
          created_at: project.CreatedAt,
          like,
          like_count: likeCnt,
        };
      }),
    );

    return {
      now,
      recently,
      archive,
      projects: projectItem,
    };
  }
}
