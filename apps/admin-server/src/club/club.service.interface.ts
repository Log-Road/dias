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

export interface IClubService {
  postClub(req: PostClubRequestDto): Promise<PostClubResponseDto>;
  getClub(req: GetClubRequestDto): Promise<GetClubResponseDto>;
  modifyClub(
    params: ModifyClubRequestDtoParams,
    req: ModifyClubRequestDto,
  ): Promise<ModifyClubResponseDto>;
  deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<DeleteClubResponseDto>;
}
