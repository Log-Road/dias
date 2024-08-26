import { User } from "../../../../../dias/src/prisma/client";
import { IsObject } from "class-validator";

export class ProjectRequestDto {
  @IsObject()
  user: User;
}
