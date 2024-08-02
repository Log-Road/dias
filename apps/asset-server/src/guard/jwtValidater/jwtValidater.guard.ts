import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { PrismaService } from "../../../../dias/src/prisma/prisma.service";

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
      await new JwtAuthGuard(
        new JwtService(),
        new PrismaService(new ConfigService()),
      ).canActivate(context);
    }

    return true;
  }
}
