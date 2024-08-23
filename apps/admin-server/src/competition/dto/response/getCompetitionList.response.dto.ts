import { IsArray, IsDateString, IsString } from "class-validator";

export class GetCompetitionListResponseDto {
  @IsArray()
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

  @IsString()
  purpose: string;

  @IsString()
  audience: string;
}
