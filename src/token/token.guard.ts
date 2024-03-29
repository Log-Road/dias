import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();

    const token: string = req.headers['authorization'];

    if (!token) throw new UnauthorizedException('토큰 필요');
    if (!token.includes(' ')) throw new UnauthorizedException('토큰 형식 오류');

    const { id } = await this.jwt.decode(token.split(' ')[1]);

    const thisUser = await this.prisma.findUserById(id.id);
    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    req.user = thisUser;

    return true;
  }

  // TODO : 구현
  async canActivateRPC(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToRpc();

    return true;
  }
}
