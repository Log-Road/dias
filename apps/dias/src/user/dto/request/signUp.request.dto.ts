import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE } from "../../../utils/type.util";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";

export class SignUpReq {
  @ApiProperty()
  @IsString({
    message: "String값 필수",
  })
  @Length(1, 10, {
    message: "이름의 길이는 1자 이상 10자 이하",
  })
  name: string;

  @ApiProperty()
  @IsString({
    message: "String값 필수",
  })
  @Length(5, 15, {
    message: "아이디 길이는 5자 이상 15자 이하",
  })
  userId: string;

  @ApiProperty()
  @IsString({
    message: "String값 필수",
  })
  @IsEmail(
    {},
    {
      message: "이메일 형식 위반",
    },
  )
  email: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "Number값 필수",
    },
  )
  @Min(1101, {
    message: "학번 최솟값 1101",
  })
  @Max(3420, {
    message: "학번 최댓값 3420",
  })
  number?: number;

  @ApiProperty()
  @IsString({
    message: "String값 필수",
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!//@#$%^*+=-])(?=.*[0-9]).{8,15}$/g, {
    message: "비밀번호 제약조건 위반",
  })
  password: string;

  @ApiProperty()
  @IsEnum(ROLE)
  role: ROLE = ROLE.Student;
}
