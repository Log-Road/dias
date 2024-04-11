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

export class SignInServiceRes {
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

  @ApiProperty({ type: "number", example: 1, description: "userId" })
  id: number;

  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEyMTI2NzI4LCJleHAiOjE3MTIxMjg1Mjh9.vCmBtuVx9FAKlUuzhyyn116E-zmdR4gH6Tdc1aTRo1Y",
    description: "access token",
  })
  accessToken: string;

  @ApiProperty({
    type: "string",
    example: "2024-04-03T07:15:28.697Z",
    description: "access token 만료 날짜",
  })
  expiredAt: string;

  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEyMTI2NzI4LCJleHAiOjE3MTMzMzYzMjh9.d1r3J33c_egFRW-riUPXdcV_T-a7QSny9vCTnHrHE_0",
    description: "refresh token",
  })
  refreshToken: string;
}

export class SignInRes {
  @ApiProperty({
    example: new SignInServiceRes(
      1,
      "awefakjl.kjoqjeok.knqldneqo",
      "2024-02-03T03:20:43",
      "lajldj.leojwokl.lskdjkla",
    ),
  })
  data: SignInServiceRes;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200 })
  statusCode: number = 200;

  @ApiProperty({ example: "OK" })
  statusMsg: string = "OK";
}
