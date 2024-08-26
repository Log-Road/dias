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

export interface IClubService {
  postClub(req: PostClubRequestDto): Promise<PostClubResponseDto>;
  getClub(req: GetClubRequestDto): Promise<GetClubResponseDto>;
  modifyClub(
    params: ModifyClubRequestDtoParams,
  ): Promise<ModifyClubResponseDto>;
  deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<DeleteClubResponseDto>;
}
