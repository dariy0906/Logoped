import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor( private readonly prisma: PrismaService ){}
  
  async register(registerAuthDto: RegisterAuthDto) {
    const { email, password, name, role = UserRole.child } = registerAuthDto;
    const existingUser = await this.prisma.profile.findUnique({
      where: { email }
    })
    if (existingUser) {
      throw new ConflictException('User already exists')
    }
    const createdUser = await this.prisma.profile.create({
      data: {
        email,
        password,
        name,
        role,
      },
    });
    const { password: _, ...userWithoutPassword } = createdUser
    return userWithoutPassword;
  }

  login(loginAuthDto: LoginAuthDto) {
    return `This action check email&password user`;
  }

  me() {
    return `this action return this user from JWT`;
  }

  delete() {
    return `This action delete user`;
  }
}
