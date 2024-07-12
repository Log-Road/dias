import { IsString } from "class-validator";

export class AwardItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}
