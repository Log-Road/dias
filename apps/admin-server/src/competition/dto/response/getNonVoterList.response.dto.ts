import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class GetNonVoterListResponseDto {
  @IsArray()
  list: List[];
}

enum CATEGORY {
  STUDENT = "Student",
  TEACHER = "Teacher",
}

class List {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsEnum(CATEGORY)
  category: CATEGORY;
}
