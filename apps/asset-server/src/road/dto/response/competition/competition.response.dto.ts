import { IsArray } from "class-validator";
import { ProjectDto } from "../common/project.dto";

export class CompetitionResponseDto {
  @IsArray()
  projects: ProjectDto[];
}
