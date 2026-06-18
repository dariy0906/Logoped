import { UserRole } from '.prisma/client/default.js';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import {
  IsSafeText,
  IsSafeUsername,
  NormalizeEmail,
  NormalizeInput,
} from './auth-input.rules.js';

export class RegisterDto {
  @NormalizeInput()
  @IsString()
  @Length(2, 40)
  @IsSafeText('Username contains forbidden code-like content')
  @IsSafeUsername()
  username!: string;

  @NormalizeEmail()
  @IsString()
  @Length(5, 120)
  @IsEmail({}, { message: 'Email must be valid' })
  @IsSafeText('Email contains forbidden code-like content')
  email!: string;

  @NormalizeInput()
  @IsString()
  @Length(8, 72)
  @IsSafeText('Password contains forbidden code-like content')
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[^\s]+$/, {
    message: 'Password must contain letters and numbers and must not contain spaces',
  })
  password!: string;

  @IsOptional()
  @NormalizeInput()
  @IsEnum(UserRole, { message: 'Role must be child or parent' })
  role?: UserRole | null;
}
