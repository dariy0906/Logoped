import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { email, password, name, role = UserRole.child } = registerAuthDto;
    const existingUser = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const createdUser = await this.prisma.profile.create({
      data: {
        email,
        password,
        name,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.password !== password) {
      throw new ConflictException('Invalid password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  me() {
    return 'Auth is simple for now, use login result on the client';
  }

  delete() {
    return 'Delete is not wired yet in the simple auth flow';
  }
}
