import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class JwtValidateGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const bearerToken: string = await req.headers["authorization"];

    if (!bearerToken) {
      req.body.user = null;
    } else {
      if (!bearerToken.startsWith("Bearer "))
        throw new UnauthorizedException("토큰 형식 오류");
      const token: String = bearerToken.split(" ")[1];
    }

    return true;
  }
}
