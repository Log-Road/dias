import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { RoadService } from "./road.service";
import { JwtValidateGuard } from "../guard/jwtValidater/jwtValidater.guard";
import { MainpageRequestDto } from "./dto/request/mainpage.request.dto";
import { MainpageResponseDto } from "./dto/response/mainpage/mainpage.response.dto";

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
}
