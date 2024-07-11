import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { RoadService } from "./road.service";
import { JwtValidateGuard } from "../guard/jwtValidater/jwtValidater.guard";
import { MainpageRequestDto } from "./dto/request/mainpage.request.dto";

@Controller("road")
export class RoadController {
  constructor(private readonly roadService: RoadService) {}

  @Get("/")
  @UseGuards(JwtValidateGuard)
  async mainpage(@Body() mainpageDto: MainpageRequestDto) {
    const data = await this.roadService.mainpage(mainpageDto);

    const res = {
      data,
      statusMsg: "OK",
      statusCode: 200,
    };

    return res;
  }
}
