/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: AuthDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (
      user &&
      user.email === dto.email &&
      (await compare(dto.pin, user.pin))
    ) {
      const { pin, ...result } = user;
      return result;
    }
    throw new NotFoundException('email or pin is invalid');
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const payload = {
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
