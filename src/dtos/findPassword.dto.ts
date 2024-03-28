import { IsString } from "class-validator";

export class FindPasswordReq {
    @IsString()
    userId: string
}