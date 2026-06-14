import { Body, Controller, Delete, Get, Headers, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Controller('auth') //DTO VALIDATION NEEDED
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') 
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  me(@Headers('authorization') authorization?: string) {
    return this.authService.me(authorization);
  }

  @Delete('me')
  deleteMe(@Headers('authorization') authorization?: string) {
    return this.authService.deleteMe(authorization);
  }
}
