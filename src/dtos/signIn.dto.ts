import { IsString } from 'class-validator';

export class SignInReq {
  @IsString()
  userId: string;

  @IsString()
  password: string;
}
