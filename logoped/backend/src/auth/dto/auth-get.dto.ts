import { IsEmail, IsEnum, IsString, Length } from "class-validator";
import { UserRole } from "@prisma/client";


export class GetAuthDto {
    @IsString()
    @Length(1)
    name: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsEnum(UserRole)
    role: UserRole;
}
