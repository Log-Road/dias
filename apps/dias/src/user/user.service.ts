import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { SignUpReq } from "./dto/request/signUp.request.dto";
import { PrismaService } from "../prisma/prisma.service";
import { compare, genSalt, hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { PASSWORD_REGEXP } from "../utils/newPassword.util";
import {
  SendEmailCommand,
  SendEmailCommandInput,
  SendEmailCommandOutput,
  SESClient,
} from "@aws-sdk/client-ses";
import { FindIdReq } from "./dto/request/findId.request.dto";
import { FindPasswordReq } from "./dto/request/findPassword.request.dto";
import { IUserService } from "./interface/user.service.interface";
import { ROLE } from "../prisma/client";

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
    @Inject(SESClient) private client: SESClient,
  ) {
    this.client = new SESClient({
      region: "ap-northeast-2",
    });
  }

  async signUp(request: SignUpReq): Promise<null> {
    this.logger.log("try signUp");
    const { name, userId, email, password, role, number } = request;

    if ((role == ROLE.Teacher && number) || (role == ROLE.Student && !number)) {
      throw new BadRequestException("제약조건 위반");
    }

    if (await this.prisma.findUserByStrId(userId))
      throw new ConflictException("이미 존재하는 Id");

    if (await this.prisma.findUserByEmail(email))
      throw new ConflictException("이미 존재하는 이메일");

    if (role == ROLE.Student && (await this.prisma.findUserByNumber(number)))
      throw new ConflictException("이미 존재하는 학번");

    await this.prisma.user.create({
      data: {
        name,
        userId,
        email,
        password: await hash(password, Number(process.env.SALT)),
        provided: "local",
        role,
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

  async sendEmailWithLogin(request): Promise<SendEmailCommandOutput> {
    this.logger.log(`Sending Email to ${request.user.name}`);

    const param: SendEmailCommandInput = {
      Source: process.env.LOG_EMAIL,
      Destination: {
        CcAddresses: [],
        ToAddresses: [],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "",
        },
      },
    };
    const command = new SendEmailCommand(param);

    try {
      const data = await this.client.send(command);
      return data;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException("이메일 전송 오류");
    }
  }
}
