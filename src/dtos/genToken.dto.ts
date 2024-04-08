import { ApiProperty } from "@nestjs/swagger";

export interface GenAccessTokenDto {
  accessToken: string;
  expiredAt: string;
}

export interface GenRefreshTokenDto {
  refreshToken: string;
}

export class GenTokenRes implements GenAccessTokenDto, GenRefreshTokenDto {
  constructor() {}
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expiredAt: string;
  @ApiProperty()
  refreshToken: string;
}
