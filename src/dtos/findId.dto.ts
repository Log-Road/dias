import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { Res } from "./response.dto";

export class FindIdReq {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: "이메일 형식 위반",
    },
  )
  email: string;
}

export class FindIdRes implements Res<string> {
  @ApiProperty({ type: String, description: "사용자 Id", example: "honGil" })
  data: string;

  @ApiProperty({ type: Number, description: "응답 코드", example: 201 })
  statusCode: number;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK" })
  statusMsg: string;
}
