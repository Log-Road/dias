import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class ProjectItemDto {
  @IsString()
  id: String;

  @IsString()
  image: String;

  @IsString()
  author_category: String;

  @IsArray()
  author: String[];

  @IsString()
  title: String;

  @IsString()
  inform: String;

  @IsString()
  created_at: String;

  @IsBoolean()
  like: Boolean;

  @IsNumber()
  like_count: Number;
}
