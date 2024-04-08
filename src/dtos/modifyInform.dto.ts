import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ModifyInformReq {
  @ApiProperty({
    name: "email",
    type: "string",
    isArray: false,
    required: true,
    readOnly: true,
  })
  @IsString()
  @IsEmail()
  email: string;
}
