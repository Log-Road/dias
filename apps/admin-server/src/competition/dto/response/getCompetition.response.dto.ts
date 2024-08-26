import { IsArray, IsDateString, IsString } from "class-validator";

export class GetCompetitionResponseDto {
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

  @IsString()
  place: string;
}
