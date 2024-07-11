import { IsArray, IsString } from "class-validator";
import { AwardItemDto } from "./awardItem.dto";

export class RecentlyItemDto {
  @IsString()
  id: String;

  @IsString()
  name: String;

  @IsArray()
  award: AwardItemDto[];
}
