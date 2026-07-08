import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UpdateAuthDto {
    @IsString()
    @Length(1)
    @IsOptional()
    name?: string;
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
