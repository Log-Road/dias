import { IsArray, IsObject, IsString } from "class-validator";
import { CompetitionDto } from "./competition.dto";
import { ProjectDto } from "./project.dto";

export class GetArchiveResponseDto {
  @IsObject()
  competitions: { [key: string]: CompetitionDto[] };

  @IsString()
  id: string;

  @IsArray()
  projects: ProjectDto[];
}
