import { IsArray } from "class-validator";
import { ProjectDto } from "./common/project.dto";

export class SearchResponseDto {
  @IsArray()
  result: ProjectDto[];
}
