import { IsBoolean, IsString } from "class-validator";

export class PostClubRequestDto {
  @IsBoolean()
  "is_active": boolean;

  @IsString()
  "club_name": string;
}
