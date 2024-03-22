import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class SignUpReq {
  @IsString({
    message: "String값 필수"
  })
  name: string;

  @IsString({
    message: "String값 필수"
  })
  @Length(0, 15, {
    message: "아이디 길이는 0자 이상 15자 이하"
  })
  userId: string;

  @IsString({
    message: "String값 필수"
  })
  @IsEmail({}, {
    message: "Email 형식 지켜야 함"
  })
  email: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  }, {
    message: "Number값 필수"
  })
  @Min(1101, {
    message: "학번 최솟값 1101"
  })
  @Max(3420, {
    message: "학번 최댓값 3420"
  })
  number?: number;

  @IsString({
    message: "String값 필수"
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!//@#$%^*+=-])(?=.*[0-9]).{8,15}$/g, {
    message: "비밀번호 제약조건 위반"
  })
  password: string;

  @IsBoolean({
    message: "Boolean값 필수"
  })
  isStudent: boolean = true;
}