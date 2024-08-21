import { IsArray, IsString } from "class-validator"

export class PostAwardsRequestDto {
  @IsArray()
  list: Awards[]
}

class Awards {
  @IsString()
  awardId: string
  
  @IsArray()
  userId: string[]
}