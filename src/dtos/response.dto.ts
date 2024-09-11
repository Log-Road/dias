import { ApiProperty } from "@nestjs/swagger";

export class Res<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ type: Number, description: "응답 코드" })
  statusCode: number;

  @ApiProperty({ type: String, description: "응답 메시지" })
  statusMsg: string;
}
