import { IsArray, IsString } from "class-validator";

export class ContestDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  duration: Date[];
}
