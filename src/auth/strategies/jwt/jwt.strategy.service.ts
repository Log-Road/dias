import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { compare } from "bcrypt";
import { Strategy } from "passport-local";
import { SignInReq } from "../../dto/request/signIn.request.dto";
import { GenTokenRes } from "../../dto/response/genToken.response.dto";
import { SignInRes } from "../../dto/response/signIn.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthUtil } from "src/utils/auth.util";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Logger) private logger: Logger,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(AuthUtil) private util: AuthUtil,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super();
  }

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
}
