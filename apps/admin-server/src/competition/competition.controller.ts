import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ICompetitionController } from "./competition.controller.interface";
import { Res } from "../dtos/response.dto";
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
import { CompetitionService } from "./competition.service";

@Controller("competition")
export class CompetitionController implements ICompetitionController {
  constructor(
    private service: CompetitionService,
    @Inject(Logger) private logger: Logger,
  ) {}

  @Post()
  async postCompetition(
    @Body() request: PostCompetitionRequestDto,
  ): Promise<Res<PostCompetitionResponseDto>> {
    const data = await this.service.postCompetition(request);

    return {
      data,
      statusCode: 201,
      statusMsg: "",
    };
  }

  @Post("/awarding/:id")
  async postAwards(
    @Param("id") id: string,
    @Body() request: PostAwardsRequestDto,
  ): Promise<Res<PostAwardsResponseDto>> {
    const data = await this.service.postAwards(id, request);

    return {
      data,
      statusCode: 201,
      statusMsg: "",
    };
  }

  @Get(":page")
  async getCompetitionList(
    @Param("page") page: string,
  ): Promise<Res<GetCompetitionListResponseDto>> {
    if (!page) page = "0";
    if (isNaN(Number(page)) || Number(page) < 0) {
      throw new BadRequestException("Parameter have to valid");
    }

    const data = await this.service.getCompetitionList(page);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
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
    if (!id) throw new BadRequestException("Must included parameter as id");

    const data = await this.service.getCompetition(id);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @Get("per/:id")
  async getVotingPrefecture(
    @Param("id") id: string,
  ): Promise<Res<GetVotingPrefectureResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Get("list?")
  async getNonVoterList(
    @Query() request: GetNonVoterListRequestDto,
  ): Promise<Res<GetNonVoterListResponseDto>> {
    throw new Error("Method not implemented.");
  }

  @Patch(":id")
  async patchCompetition(
    @Param("id") id: string,
    @Body() request: PatchCompetitionRequestDto,
  ): Promise<Res<PatchCompetitionResponseDto>> {
    const data = await this.service.patchCompetition(id, request);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }
}
