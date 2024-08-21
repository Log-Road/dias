import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ICompetitionController } from "./competition.controller.interface";
import { Res } from "../dtos/response.dto";
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
import { JwtAuthGuard } from "apps/dias/src/auth/strategies/jwt/jwt.auth.guard";
import { AdminValidateGuard } from "../guard/adminValidator/adminValidator.guard";
import { CompetitionService } from "./competition.service";

@UseGuards(JwtAuthGuard, AdminValidateGuard)
@Controller("competition")
export class CompetitionController implements ICompetitionController {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private service: CompetitionService,
  ) {}

  @Post()
  async postCompetition(
    @Body() request: PostCompetitionRequestDto,
  ): Promise<Res<PostCOmpetitionResponseDto>> {
    const data = await this.service.postCompetition(request);

    return {
      data,
      statusCode: 201,
      statusMsg: ""
    }
  }

  @Post("/awarding/:id")
  async postAwards(
    @Param("id") id: string,
    @Body() request: PostAwardsRequestDto,
  ): Promise<Res<PostAwardsResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Get()
  async getCompetitionList(): Promise<Res<GetCompetitionListResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Get("recent")
  async getRecentCompetitions(): Promise<
    Res<GetRecentCompetitionsResponseDto>
  > {
    throw new Error("Method not implemented.");
  }

  @Get("inform/:id")
  async getCompetition(
    @Param("id") id: string,
  ): Promise<Res<GetCompetitionResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Get("per/:id")
  async getVotingPrefecture(
    @Param("id") id: string,
  ): Promise<Res<GetVotingPrefectureResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Get("list?")
  async getNonVoterList(
    @Query() request: GetNonVoerListRequestDto,
  ): Promise<Res<GetNonVoterListResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Patch(":id")
  async patchCompetition(
    @Param("id") id: string,
    @Body() request: PatchComeptitionRequestDto,
  ): Promise<Res<PatchCompetitionResponseDto>> {
    throw new Error("Method not implemented.");
  }
}
