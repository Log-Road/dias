import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class SignInReq {
  @ApiProperty()
  @IsString()
  @Length(5, 15)
  userId: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SignInRes {
  constructor(
    id: number,
    accessToken: string,
    expiredAt: string,
    refreshToken: string,
  ) {
    this.id = id;
    this.accessToken = accessToken;
    this.expiredAt = expiredAt;
    this.refreshToken = refreshToken;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiredAt: string;

  @ApiProperty()
  refreshToken: string;
}
