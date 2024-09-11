import { IsEmail, IsString } from "class-validator";

export class VerificationRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  str: string;
}
