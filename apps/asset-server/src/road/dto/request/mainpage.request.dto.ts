import { User } from "apps/dias/src/prisma/client";
import { IsObject } from "class-validator";

export class mainpageRequestDto {
  @IsObject()
  user: User;
}
