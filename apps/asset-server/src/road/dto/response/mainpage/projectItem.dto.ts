import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class ProjectItemDto {
  @IsString()
  id: string;

  @IsString()
  image: string;

  @IsString()
  author_category: string;

  @IsArray()
  author: string[];

  @IsString()
  title: string;

  @IsString()
  inform: string;

  @IsString()
  created_at: Date;

  @IsBoolean()
  like: boolean;

  @IsNumber()
  like_count: number;
}
