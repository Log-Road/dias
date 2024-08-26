import { IsArray, IsString } from "class-validator";

export class NowAndArchiveItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  duration: Date[];
}
