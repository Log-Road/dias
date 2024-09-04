import {
  Injectable,
  NotFoundException,
  Inject,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NowAndArchiveItemDto } from "./dto/response/mainpage/nowAndArchiveItem.dto";
import { AwardItemDto } from "./dto/response/mainpage/awardItem.dto";
import { RecentlyItemDto } from "./dto/response/mainpage/recentlyItem.dto";
import { MainpageRequestDto } from "./dto/request/mainpage.request.dto";
import { MainpageResponseDto } from "./dto/response/mainpage/mainpage.response.dto";
import { ProjectItemDto } from "./dto/response/mainpage/projectItem.dto";
import { GetContestResponseDto } from "./dto/response/getContests/getContest.response.dto";
import { GetArchiveRequestDto } from "./dto/request/getArchive.request.dto";
import { GetArchiveResponseDto } from "./dto/response/getArchive/getArchive.response.dto";
import { CompetitionDto } from "./dto/response/getArchive/competition.dto";
import { ProjectDto } from "./dto/response/common/project.dto";
import { CompetitionResponseDto } from "./dto/response/competition/competition.response.dto";
import { CompetitionRequestDto } from "./dto/request/competition.request.dto";
import { PROJECT_STATUS, Projects } from "../prisma/client";
import { ProjectRequestDto } from "./dto/request/project.request.dto";
import { GetProjectResponseDto } from "./dto/response/getProject.response.dto";
import { SearchRequestDto } from "./dto/request/search.request.dto";
import { SearchResponseDto } from "./dto/response/search.response.dto";
import { WriteRequestDto } from "./dto/request/write.request.dto";
import { TeacherVoteRequestDto } from "./dto/request/teacherVote.request.dto";

@Injectable()
export class RoadService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async mainpage(
    mainpageRequestDto: MainpageRequestDto,
  ): Promise<MainpageResponseDto> {
    const nowDate = new Date();
    const user = mainpageRequestDto.user;

    const [contests, projects, recentlyEndedContest] = await Promise.all([
      await this.prismaService.findAllContests(),
      (await this.prismaService.findAllProjects()).slice(0, 9),
      (await this.prismaService.findContestByDateBefore(nowDate))[0],
    ]);

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
    const projectItem: ProjectItemDto[] = await Promise.all(
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
          created_at: project.created_at,
          like,
          like_count: likeCnt,
        };
      }),
    );

    return {
      now,
      recently,
      archive,
      project: projectItem,
    };
  }

  async getContests(): Promise<GetContestResponseDto> {
    const contests = await this.prismaService.findContestsOnGoing();

    const now = contests.map((contest) => {
      return {
        id: contest.id,
        name: contest.name,
        duration: [contest.start_date, contest.end_date],
      };
    });

    return { now };
  }

  async getArchive(
    comp_id: string,
    getArchiveRequestDto: GetArchiveRequestDto,
  ): Promise<GetArchiveResponseDto> {
    const user = getArchiveRequestDto.user;

    const [contests, projects] = await Promise.all([
      await this.prismaService.findContestsOnGoing(),
      await this.prismaService.findAllProjectByContestId(comp_id),
    ]);

    const processedContests: CompetitionDto[] = contests.map((contest) => {
      return {
        id: contest.id,
        name: contest.name,
        duration: [contest.start_date, contest.end_date],
      };
    });

    const boundedContests: { [key: string]: CompetitionDto[] } = {};
    processedContests.forEach((contest) => {
      const year = contest.duration[0].getFullYear();

      if (year in boundedContests) {
        boundedContests[year].push(contest);
      } else {
        boundedContests[year] = [contest];
      }
    });

    const processedProjects: ProjectDto[] = await Promise.all(
      projects.map(async (project) => {
        const likes = await this.prismaService.findAllLikeByProjectId(
          project.id,
        );

        const like =
          user != null && likes.some((like) => like.user_id === user.id); // 유저가 로그인 상태인지 && 유저가 좋아요를 눌렀는지
        return {
          id: project.id,
          image: project.image,
          authorCategory: project.auth_category,
          author: project.members,
          title: project.name,
          inform: project.introduction,
          createdAt: project.created_at,
          like,
          likeCount: likes.length,
        };
      }),
    );

    return {
      competitions: boundedContests,
      id: comp_id,
      projects: processedProjects,
    };
  }

  async getCompetition(
    id: string,
    page: number,
    req: CompetitionRequestDto,
  ): Promise<CompetitionResponseDto> {
    let projects: Projects[];
    try {
      projects = await this.prismaService.findPagedProjectByContestId(id, page);
    } catch {
      throw new NotFoundException(
        "존재하지 않는 대회, 또는 페이지를 요청했습니다",
      );
    }

    const processedProjects: ProjectDto[] = await Promise.all(
      projects.map(async (project) => {
        const likes = await this.prismaService.findAllLikeByProjectId(
          project.id,
        );
        const likeUserIdList: string[] = likes.map((like) => like.user_id);
        const isLikeChecked =
          req.user != null && likeUserIdList.includes(req.user.id);

        return {
          id: project.id,
          image: project.image,
          authorCategory: project.auth_category,
          author: project.members,
          title: project.name,
          inform: project.introduction,
          createdAt: project.created_at,
          like: isLikeChecked,
          likeCount: likes.length,
        };
      }),
    );

    return { projects: processedProjects };
  }

  async getProjectDetail(
    req: ProjectRequestDto,
    id: string,
  ): Promise<GetProjectResponseDto> {
    const project: Projects =
      await this.prismaService.findOneProjectByProjectId(id);

    if (!project) {
      throw new NotFoundException("해당 아이디의 프로젝트를 찾을 수 없습니다.");
    }

    const isAuthor = project.members.includes(req.user.name);
    const isProjectPendingOrRejected =
      project.status === PROJECT_STATUS.PENDING ||
      project.status === PROJECT_STATUS.REJECTED;

    if (!isAuthor && isProjectPendingOrRejected) {
      throw new UnauthorizedException("접근 권한이 없습니다");
    }

    const contest: { id: string; name: string } =
      await this.prismaService.findOneContestNameAndIdByContestId(
        project.contest_id,
      );

    const likes: string[] = (
      await this.prismaService.findAllLikeByProjectId(id)
    ).map((like) => like.user_id);

    return {
      id,
      contest: {
        id: contest.id,
        name: contest.name,
      },
      authorCategory: project.auth_category,
      members: project.members,
      image: project.image,
      title: project.name,
      inform: project.introduction,
      skills: project.skills,
      content: project.description,
      videoLink: project.video_link,
      like: likes.includes(req.user.id),
      likeCount: likes.length,
      isAuthor,
      isAssigned: project.status,
    };
  }

  async searchProject(
    req: SearchRequestDto,
    page: number,
    word: string,
  ): Promise<SearchResponseDto> {
    const projects: Projects[] =
      await this.prismaService.findAllProjectsContainsKeyword(word, page);

    const result: ProjectDto[] = await Promise.all(
      projects.map(async (project) => {
        const likes = await this.prismaService.findAllLikeByProjectId(
          project.id,
        );
        const isLiked = likes.some((like) => like.user_id === req.user.id);

        return {
          id: project.id,
          image: project.image,
          authorCategory: project.auth_category,
          author: project.members,
          title: project.name,
          inform: project.introduction,
          createdAt: project.created_at,
          like: isLiked,
          likeCount: likes.length,
        };
      }),
    );

    return { result };
  }

  async writeProject(writeDto: WriteRequestDto): Promise<string> {
    const { id, user, ...object } = writeDto;

    const thisContest =
      await this.prismaService.findOneContestNameAndIdByContestId(id);
    if (!thisContest) {
      throw new NotFoundException(
        "해당 id를 가지고 있는 대회가 존재하지 않습니다.",
      );
    }

    if (this.prismaService.existByUserIdAndContestId(user.id, id)) {
      throw new ConflictException(
        "이미 해당 유저가 해당 대회에서 참가한 프로젝트가 존재합니다.",
      );
    }

    const result = await this.prismaService.saveProject(object, id);

    return result.id;
  }

  async teacherVote(
    req: TeacherVoteRequestDto,
    contestId: string,
  ): Promise<void> {
    await Promise.all(
      req.vote.map(async (projectId) => {
        await this.prismaService.saveVote(req.user.id, contestId, projectId);
      }),
    );
  }
}
