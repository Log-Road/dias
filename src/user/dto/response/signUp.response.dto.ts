import { ApiProperty } from "@nestjs/swagger";
import { Res } from "src/dtos/response.dto";

export class SignUpRes implements Res<null> {
  @ApiProperty({ type: "null" })
  data: null;

  @ApiProperty({ type: Number, description: "응답 코드", example: 201 })
  statusCode: number = 201;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK" })
  statusMsg: string = "OK";
}
