import { Inject, Injectable, Logger } from "@nestjs/common";
import { ICompetitionService } from "./competition.service.interface";
import { GetNonVoerListRequestDto } from "./dto/request/getNonVoterList.request.dto";
import { PatchComeptitionRequestDto } from "./dto/request/patchCompetition.request.dto";
import { PostAwardsRequestDto } from "./dto/request/postAwards.request.dto";
import { PostCompetitionRequestDto } from "./dto/request/postCompetition.request.dto";
import { GetCompetitionResponseDto } from "./dto/response/getCompetition.response.dto";
import { GetCompetitionListResponseDto } from "./dto/response/getCompetitionList.response.dto";
import { GetNonVoterListResponseDto } from "./dto/response/getNonVoterList.response.dto";
import { GetRecentCompetitionsResponseDto } from "./dto/response/getRecentCompetitions.response.dto";
import { GetVotingPrefectureResponseDto } from "./dto/response/getVotingPrefecture.response.dto";
import { PatchCompetitionResponseDto } from "./dto/response/patchCompetition.response.dto";
import { PostAwardsResponseDto } from "./dto/response/postAwards.response.dto";
import { PostCOmpetitionResponseDto } from "./dto/response/postCompetition.response.dto";
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
  ): Promise<PostCOmpetitionResponseDto> {
    const { awards, ...competitions } = request;

    const contestId = (await this.prisma.saveCompetition(competitions)).id;
    await this.prisma.saveAwards(Object.apply(awards, { contestId }));

    return {
      id: contestId,
    };
  }

  async postAwards(
    id: string,
    request: PostAwardsRequestDto,
  ): Promise<PostAwardsResponseDto> {
    throw new Error("Method not implemented.");
  }

  async getCompetitionList(): Promise<GetCompetitionListResponseDto> {
    throw new Error("Method not implemented.");
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
    request: GetNonVoerListRequestDto,
  ): Promise<GetNonVoterListResponseDto> {
    throw new Error("Method not implemented.");
  }

  async patchCompetition(
    id: string,
    request: PatchComeptitionRequestDto,
  ): Promise<PatchCompetitionResponseDto> {
    throw new Error("Method not implemented.");
  }
}
