import { ApiProperty } from "@nestjs/swagger";

export class SignInRes {
  @ApiProperty({ type: "string", example: 1, description: "userId: UUID" })
  id: string;

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
