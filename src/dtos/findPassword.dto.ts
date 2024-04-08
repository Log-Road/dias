import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FindPasswordReq {
    @ApiProperty({
        name: "userId",
        type: "string",
        isArray: false,
        required: true,
        readOnly: true,
    })
    @IsString()
    userId: string
}