import { IsString } from "class-validator";

export class GetNonVoterListRequestDto {
  @IsString()
  id: string;

  @IsString()
  category: string;
}
