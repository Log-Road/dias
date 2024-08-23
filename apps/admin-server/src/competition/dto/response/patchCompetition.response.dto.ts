import { IsString } from "class-validator";

export class PatchCompetitionResponseDto {
  @IsString()
  id: string;
}
