import { Inject, Injectable, Logger } from "@nestjs/common";
import { IPersonService } from "./person.service.interface";
import { IndividualPatchPersonRequestDto } from "./dto/req/individualPatchPerson.request.dto";
import { PatchPersonByDocumentRequestDto } from "./dto/req/patchPersonByDocument.request.dto";
import { PostPersonByDocumentRequestDto } from "./dto/req/postPersonByDocument.request.dto";
import { SearchPersonRequestDto } from "./dto/req/searchPerson.request.dto";
import { GetPersonResponseDto } from "./dto/res/getPerson.response.dto";
import { IndividualPatchPersonResponseDto } from "./dto/res/individualPatchPerson.response.dto";
import { PatchPersonByDocumentResponseDto } from "./dto/res/patchPersonByDocument.response.dto";
import { PostPersonByDocumentResponseDto } from "./dto/res/postPersonByDocument.response.dto";
import { SearchPersonResponseDto } from "./dto/res/searchPerson.response.dto";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaService as UserPrismaService } from "../../../dias/src/prisma/prisma.service";

@Injectable()
export class PersonService implements IPersonService {
  constructor(
    @Inject(Logger) private logger: Logger,
    private prisma: PrismaService,
    private userPrisma: UserPrismaService,
  ) {}

  async getPerson(): Promise<GetPersonResponseDto> {
    throw new Error("Method not implemented.");
  }

  async searchPerson(
    request: SearchPersonRequestDto,
  ): Promise<SearchPersonResponseDto> {
    throw new Error("Method not implemented.");
  }

  async individualPatchPerson(
    request: IndividualPatchPersonRequestDto,
  ): Promise<IndividualPatchPersonResponseDto> {
    throw new Error("Method not implemented.");
  }

  async patchPersonByDocument(
    request: PatchPersonByDocumentRequestDto,
  ): Promise<PatchPersonByDocumentResponseDto> {
    throw new Error("Method not implemented.");
  }

  async postPersonByDocument(
    request: PostPersonByDocumentRequestDto,
  ): Promise<PostPersonByDocumentResponseDto> {
    return
  }
}
