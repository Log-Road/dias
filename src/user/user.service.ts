import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { SignUpReq } from "../dtos/signUp.dto";
import { PrismaService } from "../prisma/prisma.service";
import { compare, genSalt, hash } from "bcrypt";
import { FindIdReq } from "../dtos/findId.dto";
import { FindPasswordReq } from "../dtos/findPassword.dto";
import { ConfigService } from "@nestjs/config";
import { PASSWORD_REGEXP } from "../utils/newPassword.util";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async signUp(request: SignUpReq): Promise<null> {
    this.logger.log("try signUp");
    const { name, userId, email, password, isStudent, number } = request;

    if (
      (isStudent == false && number != null) ||
      (isStudent == true && number == null)
    ) {
      throw new BadRequestException("제약조건 위반");
    }

    if (await this.prisma.findUserByStrId(userId))
      throw new ConflictException("이미 존재하는 Id");

    if (await this.prisma.findUserByEmail(email))
      throw new ConflictException("이미 존재하는 이메일");

    if (isStudent && (await this.prisma.findUserByNumber(number)))
      throw new ConflictException("이미 존재하는 학번");

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

    if (!thisUser) throw new NotFoundException("존재하지 않는 유저");

    return thisUser.userId;
  }

  async findPassword(request: FindPasswordReq): Promise<object> {
    const { userId } = request;

    const thisUser = await this.prisma.findUserByStrId(userId);
    if (!thisUser) throw new NotFoundException("존재하지 않는 유저");

    const temporary = await genSalt(this.config.get<number>("SALT"));
    const password = await hash(temporary, this.config.get<number>("SALT"));

    try {
      await this.prisma.updateUserPassword(userId, password);
    } catch (error) {
      throw new InternalServerErrorException("비밀번호 수정 실패");
    }

    return { temporary };
  }

  async modifyPassword(request): Promise<null> {
    this.logger.log("Trying modify one's password");

    const { newPassword } = request;
    const thisUser = request.user;

    if (PASSWORD_REGEXP.test(newPassword) == false)
      throw new BadRequestException("비밀번호 제약조건 위반");
    if (await compare(newPassword, thisUser.password))
      throw new ConflictException("기존 비밀번호와 동일");

    try {
      const salt = await hash(
        newPassword,
        Number(this.config.get<number>("SALT")),
      );

      await this.prisma.updateUserPassword(thisUser.userId, salt);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("DB 오류");
    }

    return null;
  }

  async modifyInform(request): Promise<null> {
    this.logger.log("Trying modify One's information");

    const thisUser = request.user;

    try {
      await this.prisma.updateUserInform(thisUser.id, request.email);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException("DB 오류");
    }

    return null;
  }

  async getInform(request): Promise<object> {
    this.logger.log(`Trying get One's information`);
    return await this.prisma.findUserById(request.user.id);
  }
}
