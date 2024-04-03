import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyGuard implements CanActivate {
  private jwt: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();
    const verifyToken: string = await req.headers['verifyToken'];

    if (!verifyToken) throw new UnauthorizedException('토큰 필요');
    if (!verifyToken.includes(' '))
      throw new UnauthorizedException('토큰 형식 오류');

    const isValidReq = await this.jwt.decode(verifyToken);

    if (
      new Date(isValidReq.iat).getMilliseconds() + 1000 * 60 * 5 <
      new Date().getMilliseconds()
    )
      throw new UnauthorizedException('인증 제한 시간 초과');

    return true;
  }
}
