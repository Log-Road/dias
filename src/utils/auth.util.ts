import { JwtService } from "@nestjs/jwt";
import {
  GenAccessTokenDto,
  GenRefreshTokenDto,
} from "../auth/dto/response/genToken.response.dto";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";

export class AuthUtil {
  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
    private config: ConfigService,
  ) {}

  async genAccessToken(userId: string): Promise<GenAccessTokenDto> {
    return {
      accessToken: await this.jwt.signAsync(
        {
          id: userId,
        },
        {
          secret: this.config.get<string>("JWT_SECRET"),
          privateKey: this.config.get<string>("JWT_PRIVATE"),
        },
      ),
      expiredAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    };
  }

  async genRefreshToken(userId: string): Promise<GenRefreshTokenDto> {
    return {
      refreshToken: await this.jwt.signAsync(
        {
          id: userId,
        },
        {
          expiresIn: "14d",
          secret: this.config.get<string>("JWT_SECRET"),
          privateKey: this.config.get<string>("JWT_PRIVATE"),
        },
      ),
    };
  }

  async genAuthNumber() {
    const authNumber = String(Math.random() * 999999).padStart(6, "0");

    return authNumber;
  }
}
