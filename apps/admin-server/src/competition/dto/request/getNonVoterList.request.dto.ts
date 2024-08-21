import { IsString } from "class-validator";

export class GetNonVoerListRequestDto {
  @IsString()
  id: string;

  @IsString()
  category: string;
}
