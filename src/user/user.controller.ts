import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpReq } from '../dtos/signUp.dto';
import { Res } from '../dtos/response.dto';
import { FindIdReq } from '../dtos/findId.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Logger) private logger: Logger,
    private service: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() request: SignUpReq): Promise<Res> {
    await this.service.signUp(request);

    return {
      data: null,
      statusCode: 201,
      statusMsg: 'OK',
    };
  }

  @Post('/id')
  async findId(@Body() request: FindIdReq): Promise<Res> {
    const data = await this.service.findId(request);

    return {
      data,
      statusCode: 201,
      statusMsg: 'OK',
    };
  }
}
