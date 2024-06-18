import {
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthUtil } from "../utils/auth.util";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";
import SendEmail from "../middleware/send-email";
import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";
import {
  emailContent,
  emailTitle,
  EmailType,
} from "../dtos/sendEmail.request.dto";
import { IAuthService } from "./auth.service.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    @Inject(JwtService) private readonly jwt: JwtService,
    private config: ConfigService,
    @Inject(AuthUtil) private util: AuthUtil,
    @Inject(SendEmail) private readonly sendEmail: SendEmail,
  ) {}

  async send(req: SendEmailRequestDto): Promise<SendEmailResponseDto> {
    const { email } = req;

    const res = await this.sendEmail.send({
      email,
      title: emailTitle(EmailType.AUTH),
      content: emailContent(EmailType.AUTH),
    });
    return res;
  }
}
