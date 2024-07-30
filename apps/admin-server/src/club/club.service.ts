import { Inject, Injectable, Logger } from "@nestjs/common";
import { IClubService } from "./club.service.interface";
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
import { PrismaService } from "../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";

@Injectable()
export class ClubService implements IClubService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private userPrisma: UserPrismaService,
  ) {}

  async postClub(req: PostClubRequestDto): Promise<PostClubResponseDto> {
    const { is_active, club_name } = req;

    const clubId = (await this.prisma.saveClub(club_name, is_active)).club_id;

    return {
      club_id: clubId,
    };
  }

  async getClub(req: GetClubRequestDto): Promise<GetClubResponseDto> {
    throw new Error("Method not implemented.");
  }

  async modifyClub(
    params: ModifyClubRequestDtoParams,
    req: ModifyClubRequestDto,
  ): Promise<ModifyClubResponseDto> {
    throw new Error("Method not implemented.");
  }

  async deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<DeleteClubResponseDto> {
    throw new Error("Method not implemented.");
  }
}
