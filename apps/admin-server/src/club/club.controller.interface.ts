import { Res } from "../dtos/response.dto";
import {
  DeleteClubRequestDto,
  DeleteClubRequestDtoParams,
} from "./dto/request/deleteClub.request.dto";
import { GetClubRequestDto } from "./dto/request/getClub.request.dto";
import {
  ModifyClubRequestDto,
  ModifyClubRequestDtoParams,
} from "./dto/request/modifyClub.request.dto";
import { PostClubRequestDto } from "./dto/request/postClub.request.dto";
import { DeleteClubResponseDto } from "./dto/response/deleteClub.response.dto";
import { GetClubResponseDto } from "./dto/response/getClub.response.dto";
import { ModifyClubResponseDto } from "./dto/response/modifyClub.response.dto";
import { PostClubResponseDto } from "./dto/response/postClub.response.dto";

export interface IClubController {
  postClub(req: PostClubRequestDto): Promise<Res<PostClubResponseDto>>;
  getClub(req: GetClubRequestDto): Promise<Res<GetClubResponseDto>>;
  modifyClub(
    params: ModifyClubRequestDtoParams,
  ): Promise<Res<ModifyClubResponseDto>>;
  deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<Res<DeleteClubResponseDto>>;
}
