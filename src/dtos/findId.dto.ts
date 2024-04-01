import { IsEmail } from 'class-validator';

export class FindIdReq {
  @IsEmail(
    {},
    {
      message: '이메일 형식 위반',
    },
  )
  email: string;
}
