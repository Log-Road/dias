import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";

export interface IAuthService {
  send(req: SendEmailRequestDto): Promise<SendEmailResponseDto>;
}
