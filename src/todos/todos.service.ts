import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateTodoDto) {
    await this.userService.findOne(dto.authorId);

    const createTodo = await this.prisma.todos.create({
      data: {
        ...dto,
      },
    });

    return createTodo;
  }

  async findAll() {
    const allTodos = await this.prisma.todos.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    if (!allTodos) {
      throw new NotFoundException('todos not found');
    }

    return allTodos;
  }

  async findOne(id: number) {
    const todos = await this.prisma.todos.findUnique({
      where: {
        id,
      },
    });

    if (!todos) {
      throw new NotFoundException(`todos with id ${id} not found`);
    }

    return todos;
  }

  async update(id: number, dto: UpdateTodoDto) {
    const checkTodos = await this.findOne(id);

    if (!checkTodos) {
      throw new NotFoundException(`todos with id ${id} not found`);
    }

    const updated = await this.prisma.todos.update({
      where: {
        id,
      },
      data: {
        content: dto.content,
      },
    });

    return updated;
  }

  async remove(id: number) {
    const checkTodos = await this.findOne(id);

    if (!checkTodos) {
      throw new NotFoundException(`todos with id ${id} not found`);
    }

    const deleted = await this.prisma.todos.delete({
      where: {
        id,
      },
    });

    return deleted;
  }
}
