/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const checkEmail = await this.findByEmail(dto.email);
    if (checkEmail) {
      throw new ConflictException('duplicated email');
    }
    const encryptedPin = await hash(dto.pin, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        pin: encryptedPin,
        name: dto.name.toLowerCase(),
      },
    });
    const { pin, ...user } = newUser;
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findAll() {
    const user = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        todos: true,
      },
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        todos: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }
    return user;
  }
}
