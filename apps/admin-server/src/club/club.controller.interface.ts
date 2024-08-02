import { Res } from "../dtos/response.dto";
import {
  DeleteClubRequestDto,
  DeleteClubRequestDtoParams,
} from "./dto/req/deleteClub.request.dto";
import { GetClubRequestDto } from "./dto/req/getClub.request.dto";
import {
  ModifyClubRequestDto,
  ModifyClubRequestDtoParams,
} from "./dto/req/modifyClub.request.dto";
import { PostClubRequestDto } from "./dto/req/postClub.request.dto";
import { DeleteClubResponseDto } from "./dto/res/deleteClub.response.dto";
import { GetClubResponseDto } from "./dto/res/getClub.response.dto";
import { ModifyClubResponseDto } from "./dto/res/modifyClub.response.dto";
import { PostClubResponseDto } from "./dto/res/postClub.response.dto";

export interface IClubController {
  postClub(req: PostClubRequestDto): Promise<Res<PostClubResponseDto>>;
  getClub(req: GetClubRequestDto): Promise<Res<GetClubResponseDto>>;
  modifyClub(
    params: ModifyClubRequestDtoParams,
    req: ModifyClubRequestDto,
  ): Promise<Res<ModifyClubResponseDto>>;
  deleteClub(
    params: DeleteClubRequestDtoParams,
    req: DeleteClubRequestDto,
  ): Promise<Res<DeleteClubResponseDto>>;
}
