import { ApiProperty } from "@nestjs/swagger";
import { Res } from "../../../dtos/response.dto";

export class ModifyPasswordRes implements Res<null> {
  // TODO : { type: null }로 변경 필요 (현재 순환 종속성 오류로 인해 수정 불가능)
  @ApiProperty({ type: "null", nullable: true })
  data: null;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200 })
  statusCode: number = 200;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK" })
  statusMsg: string = "OK";
}
