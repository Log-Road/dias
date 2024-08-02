import { User } from "../../../../../dias/src/prisma/client";
import { IsObject } from "class-validator";

export class GetArchiveRequestDto {
  @IsObject()
  user: User;
}
