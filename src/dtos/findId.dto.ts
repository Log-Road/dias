import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class FindIdReq {
  @ApiProperty({
    name: "email",
    type: "string",
    isArray: false,
    required: true,
    readOnly: true,
  })
  @IsEmail(
    {},
    {
      message: '이메일 형식 위반',
    },
  )
  email: string;
}
