import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createHash } from 'node:crypto';
import { GetAuthDto } from './dto/auth-get.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<GetAuthDto> {
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

    //const { password: _, ...userWithoutPassword } = createdUser;
    //return userWithoutPassword;
    return {
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    }
  }

  async login(loginAuthDto: LoginAuthDto): Promise<GetAuthDto> {
    const { email, password } = loginAuthDto;

    const user = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      throw new NotFoundException('Invalid password');
    }

    //const { password: _, ...userWithoutPassword } = user;
    //return userWithoutPassword;
    return {
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }

  async me(email: string): Promise<GetAuthDto> {
    const user = await this.prisma.profile.findUnique({where: {email}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      email: user.email,
      name: user.name,
      role: user.role,
    }   
  }
  async update(email:string, dto: UpdateAuthDto): Promise<GetAuthDto> {
    const updating = await this.prisma.profile.findUnique({where: {email}});
    if (!updating) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.prisma.profile.update({where: {email}, data: {
      name: dto.name,
      role: dto.role,
    }})
    return {
      name: updated.name,
      email: updated.email,
      role: updated.role,
    }
  }

  async delete(email: string): Promise<GetAuthDto> {
    const deleting = await this.prisma.profile.findUnique({where: {email}})
    if(!deleting) {
      throw new NotFoundException(`User not found`)
    }
    const user = await this.prisma.profile.delete({where:{email}})
    return {
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
}
