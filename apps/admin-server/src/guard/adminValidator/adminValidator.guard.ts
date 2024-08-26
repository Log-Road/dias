import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { PrismaService } from "../../../../dias/src/prisma/prisma.service";
import { ROLE } from "../../../../dias/src/prisma/client";

@Injectable()
export class AdminValidateGuard implements CanActivate {
  constructor(private jwtAuthGuard: JwtAuthGuard) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const bearerToken: string = await req.headers["authorization"];

    if (!bearerToken.startsWith("Bearer "))
      throw new UnauthorizedException("토큰 형식 오류");
    await this.jwtAuthGuard.canActivate(context);

    if (req.body.user.role != ROLE.Admin) {
      throw new ForbiddenException();
    }

    return true;
  }
}
