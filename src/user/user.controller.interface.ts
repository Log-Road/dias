import { GetInformRes } from "../auth/dto/response/getInform.response.dto";
import { FindIdReq } from "./dto/request/findId.request.dto";
import { FindPasswordReq } from "./dto/request/findPassword.request.dto";
import { ModifyInformReq } from "./dto/request/modifyInform.request.dto";
import { ModifyPasswordReq } from "./dto/request/modifyPassword.dto";
import { SignUpReq } from "./dto/request/signUp.request.dto";
import { FindIdRes } from "./dto/response/findId.response.dto";
import { FindPasswordRes } from "./dto/response/findPassword.response.dto";
import { ModifyInformRes } from "./dto/response/modifyInform.response.dto";
import { ModifyPasswordRes } from "./dto/response/modifyPassword.dto";
import { SendEmailWithLoginRes } from "./dto/response/sendEmailWithLogin.response.dto";
import { SignUpRes } from "./dto/response/signUp.response.dto";

export interface IUserController {
  signUp(request: SignUpReq): Promise<SignUpRes>;
  findId(request: FindIdReq): Promise<FindIdRes>;
  findPassword(request: FindPasswordReq): Promise<FindPasswordRes>;
  modifyPassword(request: ModifyPasswordReq): Promise<ModifyPasswordRes>;
  modifyInform(request: ModifyInformReq): Promise<ModifyInformRes>;
  getInform(request: object): Promise<GetInformRes>;
  sendEmailWithLogin(token: object): Promise<SendEmailWithLoginRes>;
}
