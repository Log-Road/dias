import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";
import { SignInReq } from "./dto/request/signIn.request.dto";
import { GenTokenRes } from "./dto/response/genToken.response.dto";
import { SignInRes } from "./dto/response/signIn.dto";

export interface IAuthService {
  signIn(req: SignInReq): Promise<SignInRes>;

  oauth(req);

  verifyToken(req: string): Promise<GenTokenRes>;

  send(req: SendEmailRequestDto): Promise<SendEmailResponseDto>;
}
