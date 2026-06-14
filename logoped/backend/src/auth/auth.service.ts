import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Profile } from '.prisma/client/default.js';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

type PublicProfile = Omit<Profile, 'passwordHash' | 'passwordSalt'>;

type AuthResponse = {
  accessToken: string;
  profile: PublicProfile;
};

type TokenPayload = {
  sub: string;
  exp: number;
};

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private get tokenSecret() {
    return process.env.AUTH_SECRET ?? process.env.JWT_SECRET ?? 'logoped-dev-secret';
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizeUsername(username: string) {
    return username.trim();
  }

  private requireText(value: string | undefined, fieldName: string) {
    const normalized = value?.trim()

    if (!normalized) {
      throw new BadRequestException(`${fieldName} is required`)
    }

    return normalized
  }

  private hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
    const derivedKey = scryptSync(password, salt, 64);

    return {
      salt,
      hash: derivedKey.toString('hex'),
    };
  }

  private verifyPassword(password: string, salt: string, expectedHash: string) {
    const { hash } = this.hashPassword(password, salt);
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  }

  private signAccessToken(profileId: string) {
    const payload: TokenPayload = {
      sub: profileId,
      exp: Date.now() + TOKEN_TTL_MS,
    }

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = createHmac('sha256', this.tokenSecret)
      .update(encodedPayload)
      .digest('base64url')

    return `${encodedPayload}.${signature}`
  }

  private verifyAccessToken(token: string) {
    const [encodedPayload, signature] = token.split('.')

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid access token')
    }

    const expectedSignature = createHmac('sha256', this.tokenSecret)
      .update(encodedPayload)
      .digest('base64url')

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid access token')
    }

    let payload: TokenPayload

    try {
      payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as TokenPayload
    } catch {
      throw new UnauthorizedException('Invalid access token')
    }

    if (!payload.sub || !payload.exp || payload.exp < Date.now()) {
      throw new UnauthorizedException('Access token expired')
    }

    return payload
  }

  private toPublicProfile(profile: Profile): PublicProfile {
    const { passwordHash, passwordSalt, ...rest } = profile
    return rest
  }

  private extractToken(authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required')
    }

    const [scheme, token] = authorization.split(' ')

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer token is required')
    }

    return token
  }

  private async findProfileByEmail(email: string) {
    return this.prisma.profile.findUnique({
      where: {
        email,
      },
    })
  }

  private async requireProfileFromToken(authorization?: string) {
    const token = this.extractToken(authorization)
    const payload = this.verifyAccessToken(token)

    const profile = await this.prisma.profile.findUnique({
      where: {
        id: payload.sub,
      },
    })

    if (!profile) {
      throw new NotFoundException('Profile not found')
    }

    return profile
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(this.requireText(dto.email, 'email'))
    const username = this.normalizeUsername(this.requireText(dto.username, 'username'))
    const password = this.requireText(dto.password, 'password')

    const existingProfile = await this.findProfileByEmail(email)

    if (existingProfile) {
      throw new ConflictException('Profile with this email already exists')
    }

    const { salt, hash } = this.hashPassword(password)

    const createdProfile = await this.prisma.profile.create({
      data: {
        username,
        email,
        role: dto.role ?? null,
        level: 1,
        xp: 0,
        passwordHash: hash,
        passwordSalt: salt,
      },
    })

    return {
      accessToken: this.signAccessToken(createdProfile.id),
      profile: this.toPublicProfile(createdProfile),
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(this.requireText(dto.email, 'email'))
    const password = this.requireText(dto.password, 'password')

    const profile = await this.findProfileByEmail(email)

    if (!profile) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = this.verifyPassword(password, profile.passwordSalt, profile.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return {
      accessToken: this.signAccessToken(profile.id),
      profile: this.toPublicProfile(profile),
    }
  }

  async me(authorization?: string): Promise<PublicProfile> {
    const profile = await this.requireProfileFromToken(authorization)
    return this.toPublicProfile(profile)
  }

  async deleteMe(authorization?: string) {
    const profile = await this.requireProfileFromToken(authorization)

    await this.prisma.profile.updateMany({
      where: {
        OR: [{ parentId: profile.id }, { childId: profile.id }],
      },
      data: {
        parentId: null,
        childId: null,
      },
    })

    await this.prisma.profile.delete({
      where: {
        id: profile.id,
      },
    })

    return { deleted: true }
  }
}
