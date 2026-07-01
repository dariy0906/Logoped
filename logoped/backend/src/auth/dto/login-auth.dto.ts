import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
