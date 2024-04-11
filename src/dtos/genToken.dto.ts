import { ApiProperty } from "@nestjs/swagger";
import { Res } from "./response.dto";

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

export class VerifyRefreshRes implements Res<GenTokenRes> {
  @ApiProperty({ type: GenTokenRes })
  data: GenTokenRes;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200})
  statusCode: number;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK"})
  statusMsg: string;
  
}