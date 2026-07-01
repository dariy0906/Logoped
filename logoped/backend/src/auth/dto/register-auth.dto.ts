import { UserRole } from 'generated/prisma/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
