import { UseInterceptors, UsePipes } from "@nestjs/common"
import { IsArray, IsDateString, IsString } from "class-validator"

export class PostCompetitionRequestDto {
  @IsString()
  name: string

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string

  @IsString()
  purpose: string

  @IsString()
  audience: string

  @IsString()
  place: string

  @IsArray()
  awards: AwardsDto[]
}

class AwardsDto {
  name: string
  count: number
}