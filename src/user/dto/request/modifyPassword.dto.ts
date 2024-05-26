import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export interface ModifyPasswordHeader {
  verifyToken: string;
}

export class ModifyPasswordReq {
  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!//@#$%^*+=-])(?=.*[0-9]).{8,15}$/g, {
    message: "비밀번호 제약조건 위반",
  })
  newPassword: string;
}
