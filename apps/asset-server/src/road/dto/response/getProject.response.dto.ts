import { CATEGORY, PROJECT_STATUS } from "../../../prisma/client";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";

export class GetProjectResponseDto {
  @IsString()
  id: string;

  @IsObject()
  contest: {
    id: string;
    name: string;
  };

  @IsString()
  authorCategory: CATEGORY;

  @IsArray()
  members: string[];

  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsString()
  inform: string;

  @IsArray()
  skills: string[];

  @IsString()
  content: string;

  @IsString()
  videoLink: string;

  @IsBoolean()
  like: boolean;

  @IsNumber()
  likeCount: number;

  @IsBoolean()
  isAuthor: boolean;

  @IsString()
  isAssigned: PROJECT_STATUS;
}
