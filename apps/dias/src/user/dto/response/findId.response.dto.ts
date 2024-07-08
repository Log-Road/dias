import { ApiProperty } from "@nestjs/swagger";
import { Res } from "../../../dtos/response.dto";

export class FindIdRes implements Res<string> {
  @ApiProperty({ type: String, description: "사용자 Id", example: "honGil" })
  data: string;

  @ApiProperty({ type: Number, description: "응답 코드", example: 201 })
  statusCode: number;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK" })
  statusMsg: string;
}
