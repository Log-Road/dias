import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInRes } from "./dto/response/signIn.dto";
import { PrismaService } from "../prisma/prisma.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { GenTokenRes } from "./dto/response/genToken.response.dto";
import { AuthUtil } from "../utils/auth.util";
import { SignInReq } from "./dto/request/signIn.request.dto";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";
import SendEmail from "../middleware/send-email";
import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";
import {
  emailContent,
  emailTitle,
  EmailType,
} from "../dtos/sendEmail.request.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    @Inject(JwtService) private readonly jwt: JwtService,
    private config: ConfigService,
    @Inject(AuthUtil) private util: AuthUtil,
    @Inject(SendEmail) private readonly sendEmail: SendEmail,
  ) {}

  async signIn(req: SignInReq): Promise<SignInRes> {
    this.logger.log("Try to signIn");

    const { userId, password } = req;

    const thisUser = await this.prisma.findUserByStrId(userId);
    if (!thisUser) throw new NotFoundException();

    if (!(await compare(password, thisUser.password)))
      throw new BadRequestException("비밀번호 오입력");

    const accessToken = await this.util.genAccessToken(thisUser.id);
    const refreshToken = await this.util.genRefreshToken(thisUser.id);

    return {
      id: thisUser.id,
      accessToken: accessToken.accessToken,
      expiredAt: accessToken.expiredAt,
      refreshToken: refreshToken.refreshToken,
    };
  }

  async verifyToken(req: string): Promise<GenTokenRes> {
    const userId = await this.jwt.verifyAsync(req.split(" ")[1], {
      secret: this.config.get<string>("JWT_SECRET"),
      publicKey: this.config.get<string>("JWT_PRIVATE"),
    });

    if (!userId) throw new InternalServerErrorException("JWT 오류");
    if (!(await this.prisma.findUserById(userId.id)))
      throw new UnauthorizedException("존재하지 않는 유저");

    const accessToken = await this.util.genAccessToken(userId);
    const refreshToken = await this.util.genRefreshToken(userId);

    return {
      accessToken: accessToken.accessToken,
      expiredAt: accessToken.expiredAt,
      refreshToken: refreshToken.refreshToken,
    };
  }

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
