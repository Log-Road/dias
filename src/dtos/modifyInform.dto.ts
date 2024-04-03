import { IsEmail, IsString } from 'class-validator';

export class ModifyInformReq {
  @IsString()
  @IsEmail()
  email: string;
}
