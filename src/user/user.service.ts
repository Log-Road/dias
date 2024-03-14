import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { SignInReq } from 'src/dtos/signIn.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async signIn(request: SignInReq): Promise<null> {
    this.logger.debug(request)
    const { name, userId, email, password, isStudent } = request;
    const number = request.number ?? null;

    const isExistUserId = await this.prisma.findUserByStrId(userId);
    if (isExistUserId) throw new ConflictException('이미 존재하는 Id');

    const isExistUserEmail = await this.prisma.findUserByEmail(email);
    if (isExistUserEmail) throw new ConflictException('이미 존재하는 이메일');

    await this.prisma.user.create({
        data: {
            name,
            userId,
            email,
            password,
            isStudent,
            number,
        }
    });
    
    return null;
  }
}
