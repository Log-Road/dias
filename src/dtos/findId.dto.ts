import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class FindIdReq {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: '이메일 형식 위반',
    },
  )
  email: string;
}
