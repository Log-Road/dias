import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpReq } from '../dtos/signUp.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compare, genSalt, hash } from 'bcrypt';
import { FindIdReq } from '../dtos/findId.dto';
import { FindPasswordReq } from '../dtos/findPassword.dto';
import { ConfigService } from '@nestjs/config';
import {
  ModifyPasswordHeader,
  ModifyPasswordReq,
} from '../dtos/modifyPassword.dto';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD_REGEXP } from '../utils/newPassword.util';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
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

  async findId(request: FindIdReq): Promise<string> {
    const { email } = request;

    const thisUser = await this.prisma.findUserByEmail(email);

    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    return thisUser.userId;
  }

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

  async modifyPassword(
    verifyToken: ModifyPasswordHeader,
    request: ModifyPasswordReq,
    reqObj,
  ): Promise<null> {
    this.logger.log("Trying modify one's password");

    const { newPassword } = request;
    const thisUser = reqObj.user;

    if (
      PASSWORD_REGEXP.test(newPassword) == false
    )
      throw new BadRequestException('비밀번호 제약조건 위반');
    if (await compare(newPassword, thisUser.password))
      throw new ConflictException('기존 비밀번호와 동일');

    const isValidReq = await this.jwt.decode(verifyToken.verifyToken);

    if (
      new Date(isValidReq).getMilliseconds() + 1000 * 60 * 5 <
      new Date().getMilliseconds()
    )
      throw new UnauthorizedException();

    try {
      const salt = await hash(
        newPassword,
        Number(this.config.get<number>('SALT')),
      );

      await this.prisma.updateUserPassword(thisUser.userId, salt);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('DB 오류');
    }

    return null;
  }
}
