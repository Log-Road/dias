import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FindPasswordReq {
  @ApiProperty()
  @IsString()
  userId: string;
}
