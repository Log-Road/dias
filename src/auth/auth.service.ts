import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignInReq } from '../dtos/signIn.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async genAccessToken(userId: number): Promise<Object> {
    return {
      accessToken: await this.jwt.signAsync(
        {
          id: userId,
        },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          privateKey: this.config.get<string>('JWT_PRIVATE'),
        },
      ),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    };
  }

  async genRefreshToken(userId: number): Promise<Object> {
    return {
      refreshToken: await this.jwt.signAsync(
        {
          id: userId,
        },
        {
          expiresIn: '14d',
          secret: this.config.get<string>('JWT_SECRET'),
          privateKey: this.config.get<string>('JWT_PRIVATE'),
        },
      ),
    };
  }

  async signIn(req: SignInReq): Promise<Object> {
    const { userId, password } = req;

    const thisUser = await this.prisma.findUserByStrId(userId);
    if (!thisUser) throw new NotFoundException();

    if (!(await compare(password, thisUser.password)))
      throw new BadRequestException('비밀번호 오입력');

    return Object.assign(
      {
        id: thisUser.id,
      },
      await this.genAccessToken(thisUser.id),
      await this.genRefreshToken(thisUser.id),
    );
  }
}
