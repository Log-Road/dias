import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { IClubService } from "./club.service.interface";
import {
  DeleteClubRequestDtoParams,
  DeleteClubRequestDto,
} from "./dto/request/deleteClub.request.dto";
import { GetClubRequestDto } from "./dto/request/getClub.request.dto";
import {
  ModifyClubRequestDtoParams,
  ModifyClubRequestDto,
} from "./dto/request/modifyClub.request.dto";
import { PostClubRequestDto } from "./dto/request/postClub.request.dto";
import { DeleteClubResponseDto } from "./dto/response/deleteClub.response.dto";
import { GetClubResponseDto } from "./dto/response/getClub.response.dto";
import { ModifyClubResponseDto } from "./dto/response/modifyClub.response.dto";
import { PostClubResponseDto } from "./dto/response/postClub.response.dto";
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
    const isActive = req.is_active;
    const clubName = req.club_name;

    const isExistingClub = await this.prisma.findClubByName(clubName);
    if (isExistingClub) {
      throw new ConflictException();
    }

    const club = await this.prisma.saveClub(clubName, isActive);

    return {
      club_id: club.club_id,
    };
  }

  async getClub(req: GetClubRequestDto): Promise<GetClubResponseDto> {
    const clubs = await this.prisma.findClubs();

    return {
      clubs,
    };
  }

  async modifyClub(
    params: ModifyClubRequestDtoParams,
  ): Promise<ModifyClubResponseDto> {
    const { clubId } = params;

    const isExistingClub = await this.prisma.findClub(clubId);
    if (!isExistingClub) throw new NotFoundException();

    await this.prisma.patchClubStatus(clubId);
    const thisClub = await this.prisma.findClub(clubId);

    return thisClub;
  }

  async deleteClub(
    params: DeleteClubRequestDtoParams,
  ): Promise<DeleteClubResponseDto> {
    const { clubId } = params;

    const isExistingClub = await this.prisma.findClub(clubId);
    if (!isExistingClub) throw new NotFoundException();

    await this.prisma.deleteClub(clubId);

    return;
  }
}
