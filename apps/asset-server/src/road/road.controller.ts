import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { RoadService } from "./road.service";
import { JwtValidateGuard } from "../guard/jwtValidater/jwtValidater.guard";
import { MainpageRequestDto } from "./dto/request/mainpage.request.dto";
import { MainpageResponseDto } from "./dto/response/mainpage/mainpage.response.dto";
import { GetContestResponseDto } from "./dto/response/getContests/getContest.response.dto";
import { GetArchiveRequestDto } from "./dto/request/getArchive.request.dto";

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
}