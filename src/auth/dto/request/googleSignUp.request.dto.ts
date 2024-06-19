import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class GoogleSignUpRequestDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isStudent: boolean;

  @IsNumber()
  @Min(1101)
  @Max(3420)
  @IsOptional()
  number?: number;
}