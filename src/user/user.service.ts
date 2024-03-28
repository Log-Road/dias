import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { SignUpReq } from '../dtos/signUp.dto';
import { PrismaService } from '../prisma/prisma.service';
import { genSalt, hash } from 'bcrypt';
import { FindIdReq } from '../dtos/findId.dto';
import { FindPasswordReq } from '../dtos/findPassword.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  @Post('/signup')
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

    if (isStudent && (await this.prisma.findUserByNumber(number)))
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

  @Post('/id')
  async findId(request: FindIdReq): Promise<string> {
    const { email } = request;

    const thisUser = await this.prisma.findUserByEmail(email);

    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    return thisUser.userId;
  }

  @Patch('/find')
  async findPassword(request: FindPasswordReq): Promise<object> {
    const { userId } = request;

    const thisUser = await this.prisma.findUserByStrId(userId);
    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    const temporary = await genSalt(this.config.get<number>('SALT'));
    const password = await hash(temporary, this.config.get<number>('SALT'));

    try {
      await this.prisma.updateUserPassword(userId, password);
    } catch (error) {
      throw new BadRequestException('비밀번호 수정 실패');
    }

    return { temporary };
  }
}
