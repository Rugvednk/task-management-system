import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTaskId(taskId: string) {
    return this.prisma.activity.findMany({
      where: { taskId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { action: string; details?: string; taskId: string; userId?: string }) {
    let userId = data.userId;
    if (!userId) {
      const defaultUser = await this.prisma.user.findFirst();
      if (defaultUser) {
        userId = defaultUser.id;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email: 'dexter@gmail.com',
            username: 'Dexuser',
            fullName: 'Dexter',
            title: 'Designer',
          },
        });
        userId = newUser.id;
      }
    }

    return this.prisma.activity.create({
      data: {
        action: data.action,
        details: data.details,
        taskId: data.taskId,
        userId: userId,
      },
      include: {
        user: true,
      },
    });
  }
}
