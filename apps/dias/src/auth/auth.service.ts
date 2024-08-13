import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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
import { compareSync, hashSync } from "bcrypt";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { VerificationRequestDto } from "./dto/request/verification.request.dto";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    @Inject(JwtService) private readonly jwt: JwtService,
    private config: ConfigService,
    @Inject(AuthUtil) private util: AuthUtil,
    @Inject(SendEmail) private readonly sendEmail: SendEmail,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createRandString(): Promise<string> {
    const randomNumber = Math.floor(Math.random() * 999999);
    const hashed = hashSync(
      String(randomNumber).padStart(6, "0"),
      Number(process.env.SALT),
    );

    return hashed.slice(8, 14);
  }

  async send(req: SendEmailRequestDto): Promise<SendEmailResponseDto> {
    const { email } = req;
    const rand = await this.createRandString();

    await this.redis.set(email, hashSync(rand, Number(process.env.SALT)));

    setTimeout(
      async () => {
        await this.redis.del(email);
      },
      1000 * 60 * 5,
    );

    const res = await this.sendEmail.send({
      email,
      title: emailTitle(EmailType.AUTH),
      content: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>이메일인증</title>
        </head>
        <body id="Body">
          <div id="Container">
            <img
              style="width: 595px; height: 126px"
              src="${process.env.EMAIL_HEADER}"
              alt="로고입니다"
            />
            <h1>Email Verification</h1>
            <p id="Content">
              모두의 프로젝트 저장소 ROAD에서 인증번호를 보내드립니다. <br />
              아래 인증번호를 입력해주세요. <br /><br />

              인증번호는 이메일 발송 5분 이후 만료됩니다. <br /><br />

              만약 인증을 요청한 적이 없다면 여기를 클릭해주세요.
            </p>
          </div>
          <div
            style="
              text-align: center;
              width: 305px;
              font-family: pretendard;
              font-size: 32px;
              font-weight: bold;
              background-color: #e8e9fd;
              padding: 35px 0;
            "
            id="Authentication"
          >
            ${rand}
          </div>
        </body>
      </html>
      `,
    });
    return res;
  }

  async googleOAuth(req) {
    if (!req.user) throw new NotFoundException("회원가입 필요");

    return req.user;
  }

  async verification(req: VerificationRequestDto): Promise<Boolean> {
    const { email, str } = req;

    const val = await this.redis.get(email);
    if (!val) {
      throw new NotFoundException("해당 이메일 인증 요청 기록이 없습니다.");
    }
    if (compareSync(str, val)) {
      this.redis.set(email, null);
      return true;
    } else {
      throw new ConflictException("인증 코드가 올바르지 않습니다.");
    }
  }
}
