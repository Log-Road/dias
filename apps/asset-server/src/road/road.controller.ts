import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { RoadService } from "./road.service";
import { JwtValidateGuard } from "../guard/jwtValidater/jwtValidater.guard";
import { MainpageRequestDto } from "./dto/request/mainpage.request.dto";
import { MainpageResponseDto } from "./dto/response/mainpage/mainpage.response.dto";
import { GetContestResponseDto } from "./dto/response/getContests/getContest.response.dto";
import { GetArchiveRequestDto } from "./dto/request/getArchive.request.dto";
import { CompetitionRequestDto } from "./dto/request/competition.request.dto";
import { ProjectRequestDto } from "./dto/request/project.request.dto";
import { SearchRequestDto } from "./dto/request/search.request.dto";

@Controller("road")
export class RoadController {
  constructor(private readonly roadService: RoadService) {}

  @Get("/")
  @UseGuards(JwtValidateGuard)
  async mainpage(@Body() mainpageDto: MainpageRequestDto) {
    const data: MainpageResponseDto =
      await this.roadService.mainpage(mainpageDto);

    return {
      data,
      statusMsg: "OK",
      statusCode: 200,
    };
  }

  @Get("/now")
  async getContests() {
    const data: GetContestResponseDto = await this.roadService.getContests();

    return {
      data,
      statusMsg: "OK",
      statusCode: 200,
    };
  }

  @Get("/archive")
  @UseGuards(JwtValidateGuard)
  async getArchive(
    @Query("comp-id") comp_id: string,
    @Body() getArchiveRequestDto: GetArchiveRequestDto,
  ) {
    const data = await this.roadService.getArchive(
      comp_id,
      getArchiveRequestDto,
    );

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @Get("/competition")
  @UseGuards(JwtValidateGuard)
  async getCompetition(
    @Query("id") id: string,
    @Query("page") page: string,
    @Body() req: CompetitionRequestDto,
  ) {
    const data = await this.roadService.getCompetition(id, parseInt(page), req);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @Get("/project")
  @UseGuards(JwtValidateGuard)
  async getProjectDetail(
    @Body() req: ProjectRequestDto,
    @Query("id") id: string,
  ) {
    const data = await this.roadService.getProjectDetail(req, id);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @Get("/search")
  @UseGuards(JwtValidateGuard)
  async searchProjects(
    @Body() req: SearchRequestDto,
    @Query("page") page: string,
    @Query("word") word,
  ) {
    const data = await this.roadService.search(req, parseInt(page), word);

    return {
      data,
      statusMsg: "OK",
      statusCode: 200,
    };
  }
}
