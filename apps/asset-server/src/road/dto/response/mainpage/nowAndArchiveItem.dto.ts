import { IsArray, IsString } from "class-validator";

export class NowAndArchiveItemDto {
  @IsString()
  id: String;

  @IsString()
  name: String;

  @IsArray()
  duration: Date[];
}
