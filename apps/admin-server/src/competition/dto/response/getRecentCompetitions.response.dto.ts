import { ArrayMaxSize, IsArray, IsDateString, IsString } from "class-validator";

export class GetRecentCompetitionsResponseDto {
  @IsArray()
  @ArrayMaxSize(8)
  list: List[];
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
