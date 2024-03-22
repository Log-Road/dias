import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SignUpReq } from '../dtos/signUp.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async signUp(request: SignUpReq): Promise<null> {
    this.logger.log('try signUp');
    const { name, userId, email, password, isStudent, number } = request;

    if (
      (isStudent == false && number != null) ||
      (isStudent == true && number == null)
    ) {
      throw new BadRequestException('제약조건 위반');
    }

    if (await this.prisma.findUserByStrId(userId))
      throw new ConflictException('이미 존재하는 Id');

    if (await this.prisma.findUserByEmail(email))
      throw new ConflictException('이미 존재하는 이메일');

    if (isStudent && await this.prisma.findUserByNumber(number))
      throw new ConflictException('이미 존재하는 학번');

    await this.prisma.user.create({
      data: {
        name,
        userId,
        email,
        password: await hash(password, Number(process.env.SALT)),
        isStudent,
        number,
      },
    });

    return null;
  }
}
