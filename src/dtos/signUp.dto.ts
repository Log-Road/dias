import { Optional } from "@nestjs/common"
import { IsBoolean, IsEmail, IsNumber, IsString, Matches, Max, Min } from "class-validator"

export class SignUpReq {
    // @IsString()
    name: string

    // @IsString()
    // @Max(15)
    userId: string

    // @IsString()
    // @IsEmail()
    email: string

    // @Optional()
    // @IsNumber()
    // @Min(1101)
    // @Max(3420)
    number?: number

    // @IsString()
    // @Matches(/^(?=.*[a-zA-Z])(?=.*[!// @#$%^*+=-])(?=.*[0-9]).{8,15}$/g)
    password: string

    // @IsBoolean()
    isStudent: boolean = true
}