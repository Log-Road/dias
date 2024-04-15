import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { Res } from "./response.dto";

export class ModifyInformReq {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ModifyInformRes implements Res<null> {
  @ApiProperty({ type: "null", description: "수정 완료한 null 객체", example: null })
  data: null;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200})
  statusCode: number = 200;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK"})
  statusMsg: string = "OK";
}
