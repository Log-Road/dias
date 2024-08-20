import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { IPersonController } from "./person.controller.interface";
import { Res } from "../dtos/response.dto";
import { IndividualPatchPersonRequestDto } from "./dto/req/individualPatchPerson.request.dto";
import { PatchPersonByDocumentRequestDto } from "./dto/req/patchPersonByDocument.request.dto";
import { PostPersonByDocumentRequestDto } from "./dto/req/postPersonByDocument.request.dto";
import { SearchPersonRequestDto } from "./dto/req/searchPerson.request.dto";
import { GetPersonResponseDto } from "./dto/res/getPerson.response.dto";
import { IndividualPatchPersonResponseDto } from "./dto/res/individualPatchPerson.response.dto";
import { PatchPersonByDocumentResponseDto } from "./dto/res/patchPersonByDocument.response.dto";
import { PostPersonByDocumentResponseDto } from "./dto/res/postPersonByDocument.response.dto";
import { SearchPersonResponseDto } from "./dto/res/searchPerson.response.dto";
import { PersonService } from "./person.service";
import { JwtAuthGuard } from "../../../dias/src/auth/strategies/jwt/jwt.auth.guard";
import { AdminValidateGuard } from "../guard/adminValidator/adminValidator.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@UseGuards(JwtAuthGuard, AdminValidateGuard)
@Controller("person")
export class PersonController implements IPersonController {
  constructor(
    private service: PersonService,
    @Inject(Logger) private logger: Logger,
  ) {}

  @Get()
  async getPerson(): Promise<Res<GetPersonResponseDto>> {
    const data = await this.service.getPerson();

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @Get("search")
  async searchPerson(
    @Query() request: SearchPersonRequestDto,
  ): Promise<Res<SearchPersonResponseDto>> {
    const data = await this.service.searchPerson(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @Patch("individual/:person_id")
  async individualPatchPerson(
    @Body() request: IndividualPatchPersonRequestDto,
  ): Promise<Res<IndividualPatchPersonResponseDto>> {
    const data = await this.service.individualPatchPerson(request);

    return {
      data,
      statusCode: 200,
      statusMsg: "",
    };
  }

  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(303)
  @Patch("document")
  async patchPersonByDocument(
    @UploadedFile() request: Express.Multer.File,
  ): Promise<Res<PatchPersonByDocumentResponseDto>> {
    const data = await this.service.patchPersonByDocument(request);

    return {
      data,
      statusCode: 303,
      statusMsg: "", // redirecting 대상 URL을 함께 반환할 것
    };
  }

  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(303)
  @Post("document")
  async postPersonByDocument(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "jpeg" })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    request: Express.Multer.File,
  ): Promise<Res<PostPersonByDocumentResponseDto>> {
    const data = await this.service.postPersonByDocument(request);

    return {
      data,
      statusCode: 303,
      statusMsg: "", // redirecting 대상 URL을 함께 반환할 것
    };
  }
}
