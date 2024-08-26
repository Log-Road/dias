import { COMPETITION_STATUS } from "../../../prisma/client";
import { IsArray, IsDateString, IsEnum, IsString } from "class-validator";

export class GetCompetitionListResponseDto {
  @IsArray()
  list: List[];
}

class List {
  @IsString()
  id: string;

  @IsEnum(COMPETITION_STATUS)
  status: COMPETITION_STATUS;

  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
