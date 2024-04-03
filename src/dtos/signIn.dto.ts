import { IsString, Length } from 'class-validator';

export class SignInReq {
  @IsString()
  @Length(5, 15)
  userId: string;

  @IsString()
  password: string;
}
