import {
  Body,
  Controller,
  Headers,
  Inject,
  Logger,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpReq } from '../dtos/signUp.dto';
import { Res } from '../dtos/response.dto';
import { FindIdReq } from '../dtos/findId.dto';
import { FindPasswordReq } from '../dtos/findPassword.dto';
import {
  ModifyPasswordHeader,
  ModifyPasswordReq,
} from '../dtos/modifyPassword.dto';
import { TokenGuard } from '../token/token.guard';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Logger) private logger: Logger,
    private service: UserService,
  ) {}

  @Post('/signup')
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

  @Patch('/find')
  async findPassword(@Body() request: FindPasswordReq): Promise<Res> {
    const data = await this.service.findPassword(request);

    return {
      data,
      statusCode: 200,
      statusMsg: 'OK',
    };
  }

  @Patch('/modify')
  @UseGuards(TokenGuard)
  async modifyPassword(
    @Headers('verifyToken') header: ModifyPasswordHeader,
    @Body() request: ModifyPasswordReq,
    @Request() reqObj,
  ): Promise<Res> {
    const data = await this.service.modifyPassword(header, request, reqObj);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
