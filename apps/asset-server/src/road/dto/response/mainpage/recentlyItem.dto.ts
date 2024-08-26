import { IsArray, IsString } from "class-validator";
import { AwardItemDto } from "./awardItem.dto";

export class RecentlyItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  award: AwardItemDto[];
}
