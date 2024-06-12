import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SendEmailRequestDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
