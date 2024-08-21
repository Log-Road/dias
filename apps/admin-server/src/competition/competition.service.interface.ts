import { GetNonVoerListRequestDto } from "./dto/request/getNonVoterList.request.dto";
import { PatchComeptitionRequestDto } from "./dto/request/patchCompetition.request.dto";
import { PostAwardsRequestDto } from "./dto/request/postAwards.request.dto";
import { PostCompetitionRequestDto } from "./dto/request/postCompetition.request.dto";
import { GetCompetitionResponseDto } from "./dto/response/getCompetition.response.dto";
import { GetCompetitionListResponseDto } from "./dto/response/getCompetitionList.response.dto";
import { GetNonVoterListResponseDto } from "./dto/response/getNonVoterList.response.dto";
import { GetRecentCompetitionsResponseDto } from "./dto/response/getRecentCompetitions.response.dto";
import { GetVotingPrefectureResponseDto } from "./dto/response/getVotingPrefecture.response.dto";
import { PatchCompetitionResponseDto } from "./dto/response/patchCompetition.response.dto";
import { PostAwardsResponseDto } from "./dto/response/postAwards.response.dto";
import { PostCOmpetitionResponseDto } from "./dto/response/postCompetition.response.dto";

export interface ICompetitionService {
  postCompetition(
    request: PostCompetitionRequestDto,
  ): Promise<PostCOmpetitionResponseDto>;
  postAwards(
    id: string,
    request: PostAwardsRequestDto,
  ): Promise<PostAwardsResponseDto>;
  getCompetitionList(): Promise<GetCompetitionListResponseDto>;
  getRecentCompetitions(): Promise<GetRecentCompetitionsResponseDto>;
  getCompetition(id: string): Promise<GetCompetitionResponseDto>;
  getVotingPrefecture(id: string): Promise<GetVotingPrefectureResponseDto>;
  getNonVoterList(
    request: GetNonVoerListRequestDto,
  ): Promise<GetNonVoterListResponseDto>;
  patchCompetition(
    id: string,
    request: PatchComeptitionRequestDto,
  ): Promise<PatchCompetitionResponseDto>;
}
