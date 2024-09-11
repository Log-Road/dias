import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from "process";

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();
    const verifyToken: string = await req.headers['verifytoken'];

    if (!verifyToken) throw new UnauthorizedException('토큰 필요');
    if (!verifyToken.includes('Verify '))
      throw new UnauthorizedException('토큰 형식 오류');

    const isValidReq = await this.jwt.verify(verifyToken.split(' ')[1], {
      secret: process.env.JWT_SECRET,
    });

    if (
      new Date(isValidReq.iat).getMilliseconds() + 1000 * 60 * 5 <
      new Date().getMilliseconds()
    )
      throw new UnauthorizedException('인증 제한 시간 초과');

    return true;
  }
}