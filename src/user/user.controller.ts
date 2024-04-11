import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { SignUpReq, SignUpRes } from "../dtos/signUp.dto";
import { Res } from "../dtos/response.dto";
import { FindIdReq, FindIdRes } from "../dtos/findId.dto";
import { FindPasswordReq, FindPasswordRes } from "../dtos/findPassword.dto";
import {
  ModifyPasswordReq,
  ModifyPasswordRes,
} from "../dtos/modifyPassword.dto";
import { AuthGuard } from "../guard/auth/auth.guard";
import { VerifyGuard } from "../guard/verify/verify.guard";
import { ModifyInformReq, ModifyInformRes } from "../dtos/modifyInform.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { GetInformRes } from "src/dtos/getInform.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({
    summary: "회원가입",
  })
  @ApiBody({
    type: SignUpReq,
  })
  @ApiCreatedResponse({
    type: SignUpRes,
    description: "회원가입 성공",
  })
  @ApiBadRequestResponse({
    description: "isStudent와 number 간의 제약조건 불일치",
  })
  @ApiConflictResponse({
    description:
      "아이디 / 이메일 / 학번 중 하나 이상의 정보가 기존 데이터베이스에 존재",
  })
  @Post("/signup")
  async signUp(@Body() request: SignUpReq): Promise<SignUpRes> {
    await this.service.signUp(request);

    return {
      data: null,
      statusCode: 201,
      statusMsg: "OK",
    };
  }

  @ApiOperation({
    summary: "id 찾기",
  })
  @ApiBody({
    type: FindIdReq,
  })
  @ApiCreatedResponse({
    type: FindIdRes,
    description: "로그인 성공",
  })
  @ApiNotFoundResponse({
    description: "존재하지 않는 사용자",
  })
  @Post("/id")
  async findId(@Body() request: FindIdReq): Promise<FindIdRes> {
    const data = await this.service.findId(request);

    return {
      data,
      statusCode: 201,
      statusMsg: "OK",
    };
  }

  @ApiOperation({
    summary: "비밀번호 찾기 (임시 비밀번호 설정)",
  })
  @ApiBody({
    type: FindPasswordReq,
  })
  @ApiOkResponse({
    type: FindPasswordRes,
    description: "비밀번호 수정 성공",
  })
  @ApiNotFoundResponse({
    description: "존재하지 않는 사용자",
  })
  @ApiInternalServerErrorResponse({
    description: "비밀번호 수정 실패 (DB 업데이트 실패)",
  })
  @Patch("/find")
  async findPassword(@Body() request: FindPasswordReq): Promise<FindPasswordRes> {
    const data = await this.service.findPassword(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @ApiOperation({
    summary: "비밀번호 수정",
  })
  @ApiHeaders([
    {
      name: "authorization",
      description: "Bearer Token (Access)",
      example: "Bearer asdjhfkqjh.hdkfhqwe2.k3h98c93ni"
    },
    {
      name: "verifytoken",
      description: "Bearer Token (Verify)",
      example: "Bearer asdjhfkqjh.hdkfhqwe2.k3h98c93ni"
    },
  ])
  @ApiBody({
    type: ModifyPasswordReq,
  })
  @ApiOkResponse({
    description: "수정 성공 / data는 null값입니다",
    type: ModifyPasswordRes,
  })
  @ApiUnauthorizedResponse({
    description: "토큰 오류 - 기간 만료 등의 이유로 복호화 불가",
  })
  @ApiNotFoundResponse({
    description: "토큰 오류 - 존재하지 않는 사용자",
  })
  @ApiConflictResponse({
    description: "기존 비밀번호와 동일",
  })
  @ApiInternalServerErrorResponse({
    description: "비밀번호 수정 실패 (DB 업데이트 실패)",
  })
  @Patch("/modify")
  @UseGuards(AuthGuard, VerifyGuard)
  async modifyPassword(
    @Body() request: ModifyPasswordReq,
  ): Promise<ModifyPasswordRes> {
    const data = await this.service.modifyPassword(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "Ok",
    };
  }

  @ApiOperation({
    summary: "정보 수정",
  })
  @ApiBody({
    type: ModifyInformReq,
  })
  @ApiOkResponse({
    description: "정보 수정 성공",
    type: ModifyInformRes,
  })
  @ApiInternalServerErrorResponse({
    description: "정보 수정 실패 (DB 업데이트 실패)",
  })
  @Patch("/info")
  @UseGuards(AuthGuard, VerifyGuard)
  async modifyInform(
    @Body() request: ModifyInformReq,
  ): Promise<ModifyInformRes> {
    const data = await this.service.modifyInform(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }

  @ApiOperation({
    description: "정보 조회",
  })
  @ApiHeader({
    name: "authorization",
    description: "Bearer Token (Access)",
    example: "Bearer asdjhfkqjh.hdkfhqwe2.k3h98c93ni"
  })
  @ApiOkResponse({
    type: GetInformRes,
    description: "사용자 정보 조회 성공",
  })
  @ApiUnauthorizedResponse({
    description: "토큰 오류 - 기간 만료 등의 이유로 복호화 불가",
  })
  @ApiNotFoundResponse({
    description: "토큰 오류 - 존재하지 않는 사용자",
  })
  @Get("/info")
  @UseGuards(AuthGuard)
  async getInform(@Body() request: object): Promise<GetInformRes> {
    const data = await this.service.getInform(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "OK",
    };
  }
}
