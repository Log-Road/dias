import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  Post,
  Req,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInRes } from "./dto/response/signIn.dto";
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
import { Res } from "../dtos/response.dto";
import { SignInReq } from "./dto/request/signIn.request.dto";
import { GenTokenRes } from "./dto/response/genToken.response.dto";
import { SendEmailRequestDto } from "./dto/request/sendEmail.request.dto";
import { SendEmailResponseDto } from "../dtos/sendEmail.response.dto";
import { IAuthController } from "./auth.controller.interface";
import { JwtStrategyService } from "./strategies/jwt/jwt.strategy.service";
import { GoogleSignUpRequestDto } from "./dto/request/googleSignUp.request.dto";
import { GoogleStrategyService } from "./strategies/google/google.strategy.service";
import { GoogleAuthGuard } from "./strategies/google/google.auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController implements IAuthController {
  constructor(
    private service: AuthService,
    @Inject(Logger) private logger: Logger,
    @Inject(JwtStrategyService) private jwtStrategy: JwtStrategyService,
    @Inject(GoogleStrategyService)
    private googleStrategy: GoogleStrategyService,
  ) {
    this.service = service;
  }

  @ApiOperation({
    summary: "로그인",
  })
  @ApiBody({
    type: SignInReq,
  })
  @ApiCreatedResponse({
    description: "로그인 성공",
    type: SignInRes,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Post("/signin")
  async signIn(@Body() req: SignInReq): Promise<Res<SignInRes>> {
    const data = await this.jwtStrategy.signIn(req);

    return {
      data,
      statusCode: 201,
      statusMsg: "로그인",
    };
  }

  @ApiOperation({
    summary: "Google OAuth 2.0",
  })
  @ApiOkResponse({
    description: "",
  })
  @Get("/google")
  @UseGuards(GoogleAuthGuard)
  async oauth(@Request() req) {}

  @Get("/redirect")
  @UseGuards(GoogleAuthGuard)
  async oauthRedirect(@Request() req) {
    const data = await this.service.googleOAuth(req);

    return {
      data,
      statusCode: 200,
      statusMsg: "Middle of signup process",
    };
  }

  @Post("/signup")
  async oauthSignUp(@Body() request: GoogleSignUpRequestDto) {
    const data = await this.googleStrategy.googleSignUp(request);

    return {
      data,
      statusCode: 201,
      statusMsg: "Success to sign up",
    };
  }

  @ApiOperation({
    summary: "Refresh Token 검증 및 Access Token 재발급",
  })
  @ApiBearerAuth("authorization")
  @ApiOkResponse({
    type: Res<GenTokenRes>,
    description: "토큰 재생성 완료",
  })
  @ApiUnauthorizedResponse({
    description: "토큰 오류",
  })
  @ApiInternalServerErrorResponse()
  @Get("/refresh")
  async verifyToken(
    @Headers("authorization") req: string,
  ): Promise<Res<GenTokenRes>> {
    const data = await this.jwtStrategy.verifyToken(req);

    return {
      data,
      statusCode: 200,
      statusMsg: "토큰 재생성",
    };
  }

  @ApiOperation({
    summary: "인증용 이메일 발송",
  })
  @ApiOkResponse({
    type: Res<GenTokenRes>,
    description: "토큰 재생성 완료",
  })
  @ApiBadRequestResponse({
    description: "요청값 오류",
  })
  @ApiInternalServerErrorResponse({
    description: "이메일 발송 실패",
  })
  @Post("/send")
  async sendEmail(
    @Body() request: SendEmailRequestDto,
  ): Promise<Res<SendEmailResponseDto>> {
    const data = await this.service.send(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "이메일 발송 완료",
    };
  }
}
