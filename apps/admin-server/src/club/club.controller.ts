import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ClubService } from "./club.service";
import { IClubController } from "./club.controller.interface";
import { Res } from "../dtos/response.dto";
import {
  DeleteClubRequestDtoParams,
  DeleteClubRequestDto,
} from "./dto/req/deleteClub.request.dto";
import { GetClubRequestDto } from "./dto/req/getClub.request.dto";
import {
  ModifyClubRequestDtoParams,
  ModifyClubRequestDto,
} from "./dto/req/modifyClub.request.dto";
import { PostClubRequestDto } from "./dto/req/postClub.request.dto";
import { DeleteClubResponseDto } from "./dto/res/deleteClub.response.dto";
import { GetClubResponseDto } from "./dto/res/getClub.response.dto";
import { ModifyClubResponseDto } from "./dto/res/modifyClub.response.dto";
import { PostClubResponseDto } from "./dto/res/postClub.response.dto";
import { JwtAuthGuard } from "../../../dias/src/auth/strategies/jwt/jwt.auth.guard";

@UseGuards(JwtAuthGuard)
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

  async getClub(req: GetClubRequestDto): Promise<Res<GetClubResponseDto>> {
    throw new Error("Method not implemented.");
  }

  async modifyClub(
    params: ModifyClubRequestDtoParams,
    req: ModifyClubRequestDto,
  ): Promise<Res<ModifyClubResponseDto>> {
    throw new Error("Method not implemented.");
  }

  async deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<Res<DeleteClubResponseDto>> {
    throw new Error("Method not implemented.");
  }
}
