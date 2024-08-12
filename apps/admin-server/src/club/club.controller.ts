import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { IClubController } from "./club.controller.interface";
import { Res } from "../dtos/response.dto";
import {
  DeleteClubRequestDtoParams,
  DeleteClubRequestDto,
} from "./dto/req/deleteClub.request.dto";
import { GetClubRequestDto } from "./dto/req/getClub.request.dto";
import { ModifyClubRequestDtoParams } from "./dto/req/modifyClub.request.dto";
import { PostClubRequestDto } from "./dto/req/postClub.request.dto";
import { DeleteClubResponseDto } from "./dto/res/deleteClub.response.dto";
import { GetClubResponseDto } from "./dto/res/getClub.response.dto";
import { ModifyClubResponseDto } from "./dto/res/modifyClub.response.dto";
import { PostClubResponseDto } from "./dto/res/postClub.response.dto";
import { JwtAuthGuard } from "../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { AdminValidateGuard } from "../guard/adminValidator/adminValidator.guard";

@UseGuards(JwtAuthGuard, AdminValidateGuard)
@Controller("club")
export class ClubController implements IClubController {
  constructor(
    private service: ClubService,
    @Inject(Logger) private logger: Logger,
  ) {}

  @Post()
  async postClub(
    @Body() req: PostClubRequestDto,
  ): Promise<Res<PostClubResponseDto>> {
    const data = await this.service.postClub(req);

    return {
      data,
      statusCode: 201,
      statusMsg: "",
    };
  }

  @Get()
  async getClub(req: GetClubRequestDto): Promise<Res<GetClubResponseDto>> {
    const data = await this.service.getClub(req);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @Patch("modify/:clubId")
  async modifyClub(
    @Param() params: ModifyClubRequestDtoParams,
  ): Promise<Res<ModifyClubResponseDto>> {
    if (!params) throw new BadRequestException();
    const data = await this.service.modifyClub(params);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @Delete("/:clubId")
  async deleteClub(
    @Param() params: DeleteClubRequestDtoParams,
  ): Promise<Res<DeleteClubResponseDto>> {
    if (!params) throw new BadRequestException();
    const data = await this.service.deleteClub(params);

    return {
      data,
      statusCode: 204,
      statusMsg: "",
    };
  }
}
