import { CATEGORY } from "../../../../prisma/client";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from "class-validator";

export class ProjectDto {
  @IsString()
  id: string;

  @IsString()
  image: string;

  @IsString()
  author_category: CATEGORY;

  @IsArray()
  author: string[];

  @IsString()
  title: string;

  @IsString()
  inform: string;

  @IsDate()
  created_at: Date;

  @IsBoolean()
  like: boolean;

  @IsNumber()
  like_count: number;
}
