import { ApiProperty } from "@nestjs/swagger";
import { Res } from "../../../dtos/response.dto";

export class FindPasswordRes implements Res<object> {
  @ApiProperty({
    type: Object,
    description: "임시 비밀번호",
    example: { temporary: "hjd#o2kldnkf!@sd" },
  })
  data: object;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200 })
  statusCode: number = 200;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK" })
  statusMsg: string;
}
