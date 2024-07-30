import { IsArray } from "class-validator";
import { ContestDto } from "./contest.dto";

export class GetContestResponseDto {
  @IsArray()
  now: ContestDto[];
}
