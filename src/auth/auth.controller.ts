import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Res } from '../dtos/response.dto';
import { SignInReq } from '../dtos/signIn.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        @Inject(Logger) private logger: Logger,
    ) {
        this.authService = authService
    }

    @Post('/signin')
    async signIn(@Body() req: SignInReq): Promise<Res> {
        const data = await this.authService.signIn(req);

        return {
            data,
            statusCode: 201,
            statusMsg: "로그인"
        }
    }
}
