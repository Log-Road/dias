import { Res } from "../dtos/response.dto";
import { GetNonVoterListRequestDto } from "./dto/request/getNonVoterList.request.dto";
import { PatchCompetitionRequestDto } from "./dto/request/patchCompetition.request.dto";
import { PostAwardsRequestDto } from "./dto/request/postAwards.request.dto";
import { PostCompetitionRequestDto } from "./dto/request/postCompetition.request.dto";
import { GetCompetitionResponseDto } from "./dto/response/getCompetition.response.dto";
import { GetCompetitionListResponseDto } from "./dto/response/getCompetitionList.response.dto";
import { GetNonVoterListResponseDto } from "./dto/response/getNonVoterList.response.dto";
import { GetRecentCompetitionsResponseDto } from "./dto/response/getRecentCompetitions.response.dto";
import { GetVotingPrefectureResponseDto } from "./dto/response/getVotingPrefecture.response.dto";
import { PatchCompetitionResponseDto } from "./dto/response/patchCompetition.response.dto";
import { PostAwardsResponseDto } from "./dto/response/postAwards.response.dto";
import { PostCompetitionResponseDto } from "./dto/response/postCompetition.response.dto";

export interface ICompetitionController {
  postCompetition(
    request: PostCompetitionRequestDto,
  ): Promise<Res<PostCompetitionResponseDto>>;
  postAwards(
    id: string,
    request: PostAwardsRequestDto,
  ): Promise<Res<PostAwardsResponseDto>>;
  getCompetitionList(page: string): Promise<Res<GetCompetitionListResponseDto>>;
  getRecentCompetitions(): Promise<Res<GetRecentCompetitionsResponseDto>>;
  getCompetition(id: string): Promise<Res<GetCompetitionResponseDto>>;
  getVotingPrefecture(id: string): Promise<Res<GetVotingPrefectureResponseDto>>;
  getNonVoterList(
    request: GetNonVoterListRequestDto,
  ): Promise<Res<GetNonVoterListResponseDto>>;
  patchCompetition(
    id: string,
    request: PatchCompetitionRequestDto,
  ): Promise<Res<PatchCompetitionResponseDto>>;
}
