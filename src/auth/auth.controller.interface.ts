import { Res } from "src/dtos/response.dto";
import { SignInReq } from "./dto/request/signIn.request.dto";
import { SignInRes } from "./dto/response/signIn.dto";
import { GenTokenRes } from "./dto/response/genToken.response.dto";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";
import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";

export interface IAuthController {
  signIn(req: SignInReq): Promise<Res<SignInRes>>;
  oauth(req);
  verifyToken(req: string): Promise<Res<GenTokenRes>>;
  sendEmail(request: SendEmailRequestDto): Promise<Res<SendEmailResponseDto>>;
}
