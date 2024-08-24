import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ICompetitionService } from "./competition.service.interface";
import { GetNonVoterListRequestDto } from "./dto/request/getNonVoterList.request.dto";
import { PatchCompetitionRequestDto } from "./dto/request/patchCompetition.request.dto";
import { PostAwardsRequestDto } from "./dto/request/postAwards.request.dto";
import { PostCompetitionRequestDto } from "./dto/request/postCompetition.request.dto";
import { GetCompetitionResponseDto } from "./dto/response/getCompetition.response.dto";
import { GetCompetitionListResponseDto } from "./dto/response/getCompetitionList.response.dto";
import { GetNonVoterListResponseDto } from "./dto/response/getNonVoterList.response.dto";
import { GetRecentCompetitionsResponseDto } from "./dto/response/getRecentCompetitions.response.dto";
import { GetVotingPrefectureResponseDto } from "./dto/response/getVotingPrefecture.response.dto";
import { PatchCompetitionResponseDto } from "./dto/response/patchCompetition.response.dto";
import { PostAwardsResponseDto } from "./dto/response/postAwards.response.dto";
import { PostCompetitionResponseDto } from "./dto/response/postCompetition.response.dto";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CompetitionService implements ICompetitionService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private prisma: PrismaService,
    private userPrisma: UserPrismaService,
  ) {}

  async postCompetition(
    request: PostCompetitionRequestDto,
  ): Promise<PostCompetitionResponseDto> {
    const { awards, ...competitions } = request;

    const contestId = (await this.prisma.saveCompetition(competitions)).id;
    awards.map(async (award) => {
      await this.prisma.saveAwards(Object.assign(award, { contestId }));
    });

    return {
      id: contestId,
    };
  }

  async postAwards(
    competitionId: string,
    request: PostAwardsRequestDto,
  ): Promise<PostAwardsResponseDto> {
    const { list } = request;

    const thisCompetition =
      await this.prisma.findCompetitionById(competitionId);
    if (!thisCompetition) {
      throw new NotFoundException();
    }

    await Promise.all(
      list.map(async (award) => {
        const { awardId, userId } = award;

        await Promise.all(
          userId.map(async (id) => {
            await this.prisma.saveWinner(competitionId, {
              awardId,
              userId: id,
            });
          }),
        );
      }),
    );

    return {};
  }

  async getCompetitionList(
    page: string,
  ): Promise<GetCompetitionListResponseDto> {
    const list = await this.prisma.findCompetitionList(Number(page));
    if (list.length < 1) throw new NotFoundException();

    const aliasList = list.map(x => {
      return {
        id: x.id,
        status: x.status,
        name: x.name,
        startDate: x.start_date.toISOString(),
        endDate: x.end_date.toISOString(),
      };
    });

    return { list: aliasList };
  }

  async getRecentCompetitions(): Promise<GetRecentCompetitionsResponseDto> {
    throw new Error("Method not implemented.");
  }

  async getCompetition(id: string): Promise<GetCompetitionResponseDto> {
    throw new Error("Method not implemented.");
  }

  async getVotingPrefecture(
    id: string,
  ): Promise<GetVotingPrefectureResponseDto> {
    throw new Error("Method not implemented.");
  }

  async getNonVoterList(
    request: GetNonVoterListRequestDto,
  ): Promise<GetNonVoterListResponseDto> {
    throw new Error("Method not implemented.");
  }

  async patchCompetition(
    id: string,
    request: PatchCompetitionRequestDto,
  ): Promise<PatchCompetitionResponseDto> {
    throw new Error("Method not implemented.");
  }
}
