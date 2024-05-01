import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInReq, SignInServiceRes } from "../dtos/signIn.dto";
import { PrismaService } from "../prisma/prisma.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  GenTokenRes,
} from "../dtos/genToken.dto";
import { AuthUtil } from "./auth.util"

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private readonly jwt: JwtService,
    private config: ConfigService,
    private util: AuthUtil,
  ) {}

  async signIn(req: SignInReq): Promise<SignInServiceRes> {
    this.logger.log("Try to signIn");

    const { userId, password } = req;

    const thisUser = await this.prisma.findUserByStrId(userId);
    if (!thisUser) throw new NotFoundException();

    if (!(await compare(password, thisUser.password)))
      throw new BadRequestException("비밀번호 오입력");

    const accessToken = await this.util.genAccessToken(thisUser.id);
    const refreshToken = await this.util.genRefreshToken(thisUser.id);

    return new SignInServiceRes(
      thisUser.id,
      accessToken.accessToken,
      accessToken.expiredAt,
      refreshToken.refreshToken,
    );
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
}
