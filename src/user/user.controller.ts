import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInReq } from 'src/dtos/signIn.dto';
import { Res } from 'src/dtos/response.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Logger) private logger: Logger,
    private service: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() request): Promise<Res> {
    console.log(request);
    await this.service.signIn(request);

    return {
      data: null,
      statusCode: 201,
      statusMsg: 'OK',
    };
  }
}
