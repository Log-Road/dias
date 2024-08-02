import { User } from "apps/dias/src/prisma/client";

export class DeleteClubRequestDto {
  "user": User;
}

export class DeleteClubRequestDtoParams {
  "club_id": string;
}
