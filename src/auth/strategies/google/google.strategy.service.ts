import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuthUtil } from "../../../utils/auth.util";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { hash } from "bcrypt";
import { GoogleSignUpRequestDto } from "../../dto/request/googleSignUp.request.dto";
import { configDotenv } from "dotenv";

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
    configDotenv();

    super({
      clientID: config.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: config.get<string>("GOOGLE_SECURE_PASSWORD"),
      callbackURL: config.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["profile", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const { name, email, sub } = profile._json;
      const user = {
        email,
        name,
        accessToken,
        refreshToken,
        sub,
      };

      done(null, user);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException({ error: e });
    }
  }

  async googleSignUp(request: GoogleSignUpRequestDto) {
    const { name, email, userId, isStudent } = request;
    const number = request.number ?? 0;

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
