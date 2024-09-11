import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class SignInReq {
  @ApiProperty()
  @IsString()
  @Length(5, 15)
  userId: string;

  @ApiProperty()
  @IsString()
  password: string;
}