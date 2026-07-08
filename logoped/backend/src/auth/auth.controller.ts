import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  
  @Get('me/:email')
  me(@Param('email') email: string) {
    return this.authService.me(email);
  }

  @Patch('update/:email')
  update(@Param('email') email: string, @Body() updateAuthDto: UpdateAuthDto){
    return this.authService.update(email, updateAuthDto);
  }

  @Delete('delete/:email')
  delete(@Param('email') email: string) {
    return this.authService.delete(email);
  }
}