import { JwtService } from "@nestjs/jwt";
import { GenAccessTokenDto, GenRefreshTokenDto } from "../dtos/genToken.dto";
import { ConfigService } from "@nestjs/config";

export class AuthUtil {
  constructor(
    private readonly jwt: JwtService,
    private config: ConfigService,
  ) {}

  async genAccessToken(userId: number): Promise<GenAccessTokenDto> {
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

  async genRefreshToken(userId: number): Promise<GenRefreshTokenDto> {
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
}
