import { User } from "apps/dias/src/prisma/client";

export class ModifyClubRequestDto {
  "user": User;
}

export class ModifyClubRequestDtoParams {
  "club_id": string;
}
