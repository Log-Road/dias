import { IsNumber } from "class-validator";

export class GetVotingPrefectureResponseDto {
  @IsNumber()
  student: number;

  @IsNumber()
  teacher: number;
}
