import { IsArray, IsObject, IsString } from "class-validator";
import { CATEGORY } from "../../../prisma/client";
import { User } from "apps/dias/src/prisma/client";

export class WriteRequestDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  auth_category: CATEGORY;

  @IsArray()
  members: string[];

  @IsArray()
  skills: string[];

  @IsString()
  introduction: string;

  @IsString()
  video_link: string;

  @IsString()
  description: string;

  @IsObject()
  user: User;
}
