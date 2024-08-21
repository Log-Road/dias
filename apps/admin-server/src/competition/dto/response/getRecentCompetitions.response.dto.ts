import { IsArray, IsDateString, IsString, MaxLength } from "class-validator";

export class GetRecentCompetitionsResponseDto {
  @IsArray()
  @MaxLength(8)
  list: List[]
}

class List {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
