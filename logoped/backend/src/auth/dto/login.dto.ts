import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsSafeText, NormalizeEmail, NormalizeInput } from './auth-input.rules.js';

export class LoginDto {
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
}
