import { COMPETITION_STATUS } from "../../../prisma/client";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class PatchCompetitionRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(COMPETITION_STATUS)
  status?: COMPETITION_STATUS;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  audience?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsArray()
  awards?: Awards[];
}

class Awards {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}
