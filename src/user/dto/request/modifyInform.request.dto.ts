import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ModifyInformReq {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
