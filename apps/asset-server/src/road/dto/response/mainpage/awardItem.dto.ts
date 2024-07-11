import { IsString } from "class-validator";

export class AwardItemDto {
  @IsString()
  id: String;

  @IsString()
  name: String;
}
