import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthUtil } from "src/utils/auth.util";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { hash } from "bcrypt";
import { GoogleSignUpRequestDto } from "src/auth/dto/request/googleSignUp.request.dto";

@Injectable()
export class GoogleStrategyService extends PassportStrategy(
  Strategy,
  "google",
) {
  constructor(
    @Inject(Logger) private logger: Logger,
    @Inject(AuthUtil) private util: AuthUtil,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(ConfigService) private config: ConfigService,
  ) {
    super({
      clientID: config.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: config.get<string>("GOOGLE_SECRET"),
      callbackURL: config.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const userId = profile.id;
      const { /*picture,*/ name, email } = profile._json;

      let user = await this.prisma.findUserByStrId(userId);
      if (!user) {
        return {
          name,
          userId,
          email,
        };
      }

      done(null, user);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async googleSignUp(request: GoogleSignUpRequestDto) {
    const { name, email, userId, isStudent } = request;
    const number = request.number ?? 0

    await this.prisma.user.create({
      data: {
        name,
        email,
        userId,
        password: await hash(userId, Number(process.env.SALT)),
        provided: "google",
        isStudent,
        number,
      },
    });
  }
}
