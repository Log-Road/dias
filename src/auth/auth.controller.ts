import { Controller, Inject, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        @Inject(Logger) private logger: Logger,
    ) {
        this.authService = authService
    }
}
