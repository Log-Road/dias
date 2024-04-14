import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInReq, SignInRes } from "../dtos/signIn.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { VerifyRefreshRes } from "../dtos/genToken.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(Logger) private logger: Logger,
  ) {
    this.authService = authService;
  }

  @ApiOperation({
    summary: "로그인"
  })
  @ApiBody({
    type: SignInReq,
  })
  @ApiCreatedResponse({
    description: "로그인 성공",
    type: SignInRes
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Post("/signin")
  async signIn(@Body() req: SignInReq): Promise<SignInRes> {
    const data = await this.authService.signIn(req);

    return {
      data,
      statusCode: 201,
      statusMsg: "로그인",
    };
  }

  @ApiOperation({
    summary: "Refresh Token 검증 및 Access Token 재발급",
  })
  @ApiBearerAuth("authorization")
  @ApiOkResponse({
    type: VerifyRefreshRes,
    description: "토큰 재생성 완료",
  })
  @ApiUnauthorizedResponse({
    description: "토큰 오류",
  })
  @ApiInternalServerErrorResponse()
  @Get("/refresh")
  async verifyToken(
    @Headers("authorization") req: string,
  ): Promise<VerifyRefreshRes> {
    const data = await this.authService.verifyToken(req);

    return {
      data,
      statusCode: 200,
      statusMsg: "토큰 재생성",
    };
  }
}
