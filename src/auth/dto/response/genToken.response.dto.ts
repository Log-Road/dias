import { ApiProperty } from "@nestjs/swagger";
import { Res } from "../../../dtos/response.dto";

export interface GenAccessTokenDto {
  accessToken: string;
  expiredAt: string;
}

export interface GenRefreshTokenDto {
  refreshToken: string;
}

export class GenTokenRes implements GenAccessTokenDto, GenRefreshTokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiredAt: string;

  @ApiProperty()
  refreshToken: string;
}
