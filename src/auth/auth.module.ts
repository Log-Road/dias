import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, Logger],
  controllers: [AuthController]
})
export class AuthModule {}
