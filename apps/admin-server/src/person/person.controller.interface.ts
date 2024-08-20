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

export interface IPersonController {
  getPerson(): Promise<Res<GetPersonResponseDto>>;
  searchPerson(
    request: SearchPersonRequestDto,
  ): Promise<Res<SearchPersonResponseDto>>;
  individualPatchPerson(
    request: IndividualPatchPersonRequestDto,
  ): Promise<Res<IndividualPatchPersonResponseDto>>;
  patchPersonByDocument(
    request: PatchPersonByDocumentRequestDto,
  ): Promise<Res<PatchPersonByDocumentResponseDto>>;
  postPersonByDocument(
    request: PostPersonByDocumentRequestDto,
  ): Promise<Res<PostPersonByDocumentResponseDto>>;
}
