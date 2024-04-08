import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SignInReq {
  @ApiProperty({
    name: "userId",
    type: "string",
    minLength: 5,
    maxLength: 15,
    isArray: false,
    required: true,
    readOnly: true,
  })
  @IsString()
  @Length(5, 15)
  userId: string;

  @ApiProperty({
    name: "password",
    type: "string",
    minLength: 1,
    isArray: false,
    required: true,
    readOnly: true,
  })
  @IsString()
  password: string;
}
