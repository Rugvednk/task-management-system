import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskMemberDto } from './dto/create-task-member.dto';

@Injectable()
export class TaskMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(taskId?: string) {
    return this.prisma.taskMember.findMany({
      where: taskId ? { taskId } : undefined,
      include: {
        user: true,
        task: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.taskMember.findUnique({
      where: { id },
      include: {
        user: true,
        task: true,
      },
    });

    if (!member) {
      throw new NotFoundException(
        `Task member with ID ${id} not found`,
      );
    }

    return member;
  }

  async create(data: CreateTaskMemberDto) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: data.taskId,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${data.taskId} not found`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${data.userId} not found`,
      );
    }

    const existingMember = await this.prisma.taskMember.findUnique({
      where: {
        taskId_userId: {
          taskId: data.taskId,
          userId: data.userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException(
        'User is already assigned to this task',
      );
    }

    return this.prisma.taskMember.create({
      data: {
        taskId: data.taskId,
        userId: data.userId,
      },
      include: {
        user: true,
        task: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.taskMember.delete({
      where: {
        id,
      },
    });
  }
}