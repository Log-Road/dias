import { IsArray, IsString } from "class-validator";

export class CompetitionDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  duration: Date[];
}
