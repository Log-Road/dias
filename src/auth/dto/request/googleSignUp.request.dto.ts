import { ROLE } from "../../../prisma/client";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
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

  @IsEnum(ROLE)
  role: ROLE;

  @IsNumber()
  @Min(1101)
  @Max(3420)
  @IsOptional()
  number?: number;
}
