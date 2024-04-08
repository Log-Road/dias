import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { SignUpReq } from "../dtos/signUp.dto";
import { Res } from "../dtos/response.dto";
import { FindIdReq } from "../dtos/findId.dto";
import { FindPasswordReq } from "../dtos/findPassword.dto";
import { ModifyPasswordReq } from "../dtos/modifyPassword.dto";
import { AuthGuard } from "../guard/auth/auth.guard";
import { VerifyGuard } from "../guard/verify/verify.guard";
import { ModifyInformReq } from "../dtos/modifyInform.dto";

@Controller("user")
export class UserController {
  constructor(private service: UserService) {}

  @Post("/signup")
  async signUp(@Body() request: SignUpReq): Promise<Res<null>> {
    await this.service.signUp(request);

    return {
      data: null,
      statusCode: 201,
      statusMsg: "OK",
    };
  }

  @Post("/id")
  async findId(@Body() request: FindIdReq): Promise<Res<string>> {
    const data = await this.service.findId(request);

    return {
      data,
      statusCode: 201,
      statusMsg: "OK",
    };
  }

  @Patch("/find")
  async findPassword(@Body() request: FindPasswordReq): Promise<Res<object>> {
    const data = await this.service.findPassword(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @Patch("/modify")
  @UseGuards(AuthGuard, VerifyGuard)
  async modifyPassword(@Body() request: ModifyPasswordReq): Promise<Res<null>> {
    const data = await this.service.modifyPassword(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "Ok",
    };
  }

  @Patch("/info")
  @UseGuards(AuthGuard, VerifyGuard)
  async modifyInform(@Body() request: ModifyInformReq): Promise<Res<null>> {
    const data = await this.service.modifyInform(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @Get("/info")
  @UseGuards(AuthGuard)
  async getInform(@Body() request: object): Promise<Res<object>> {
    const data = await this.service.getInform(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }
}
