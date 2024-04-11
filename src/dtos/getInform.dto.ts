import { ApiProperty } from "@nestjs/swagger";
import { Res } from "./response.dto";

export class GetInformRes implements Res<object> {
  @ApiProperty({ type: Object, description: "사용자 객체", example: {
    id: 1,
    userId: "honGil",
    name: "홍길동",
    email: "donGil@dsm.hs.kr",
    isStudent: true,
    number: 1234
  }})
  data: object;

  @ApiProperty({ type: Number, description: "응답 코드", example: 200})
  statusCode: number = 200;

  @ApiProperty({ type: String, description: "응답 메시지", example: "OK"})
  statusMsg: string;

}

/**
 * {
        id: true,
        userId: true,
        name: true,
        email: true,
        isStudent: true,
        number: true,
      },
 */