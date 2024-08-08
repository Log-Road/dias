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
  authorCategory: CATEGORY;

  @IsArray()
  author: string[];

  @IsString()
  title: string;

  @IsString()
  inform: string;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  like: boolean;

  @IsNumber()
  likeCount: number;
}
