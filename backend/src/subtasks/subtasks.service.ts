import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subtask.findMany({
      include: {
        task: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id },
      include: {
        task: true,
      },
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    return subtask;
  }

  async create(data: CreateSubtaskDto) {
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

    return this.prisma.subtask.create({
      data: {
        title: data.title,
        priority: data.priority,
        dueDate: data.dueDate
          ? new Date(data.dueDate)
          : undefined,
        completed: data.completed,
        taskId: data.taskId,
      },
    });
  }

  async update(id: string, data: UpdateSubtaskDto) {
    return this.prisma.subtask.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        priority: data.priority,
        dueDate: data.dueDate
          ? new Date(data.dueDate)
          : undefined,
        completed: data.completed,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.subtask.delete({
      where: {
        id,
      },
    });
  }
}