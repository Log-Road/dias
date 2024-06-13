import { SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { FindIdReq } from "./dto/request/findId.request.dto";
import { SignUpReq } from "./dto/request/signUp.request.dto";
import { FindPasswordReq } from "./dto/request/findPassword.request.dto";
import { ModifyInformReq } from "./dto/request/modifyInform.request.dto";
import { ModifyPasswordReq } from "./dto/request/modifyPassword.dto";

export interface IUserService {
  signUp(request: SignUpReq): Promise<null>;
  findId(request: FindIdReq): Promise<string>;
  findPassword(request: FindPasswordReq): Promise<object>;
  modifyPassword(request: ModifyPasswordReq): Promise<null>;
  modifyInform(request: ModifyInformReq): Promise<null>;
  getInform(request: object): Promise<object>;
  sendEmailWithLogin(request: object): Promise<SendEmailCommandOutput>;
}
