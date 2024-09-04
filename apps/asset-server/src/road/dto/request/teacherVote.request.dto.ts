import { User } from "apps/dias/src/prisma/client";
import { IsArray, IsObject } from "class-validator";

export class TeacherVoteRequestDto {
  @IsArray()
  vote: string[];

  @IsObject()
  user: User;
}
