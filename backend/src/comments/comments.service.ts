import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTaskId(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: CreateCommentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${data.taskId} not found`);
    }

    let userId = data.userId;
    if (!userId) {
      const defaultUser = await this.prisma.user.findFirst();
      if (defaultUser) {
        userId = defaultUser.id;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email: 'guest@pyramid.com',
            username: 'guest',
            fullName: 'Guest User',
          },
        });
        userId = newUser.id;
      }
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        userId: userId,
      },
      include: {
        user: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
