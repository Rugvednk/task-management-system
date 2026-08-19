import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateDefaultProject() {
    let project = await this.prisma.project.findFirst();
    if (!project) {
      let workspace = await this.prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await this.prisma.workspace.create({
          data: { name: 'Pyramid Workspace' },
        });
      }
      project = await this.prisma.project.create({
        data: {
          name: 'Pyramid Assessment Project',
          description: 'Main default workspace project',
          workspaceId: workspace.id,
        },
      });
    }
    return project;
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        project: true,
        members: {
          include: {
            user: true,
          },
        },
        subtasks: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        members: {
          include: {
            user: true,
          },
        },
        subtasks: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(data: Partial<CreateTaskDto> & { title: string; projectId?: string }) {
    let targetProjectId = data.projectId;

    if (targetProjectId) {
      const projectExists = await this.prisma.project.findUnique({
        where: { id: targetProjectId },
      });
      if (!projectExists) {
        const defaultProj = await this.getOrCreateDefaultProject();
        targetProjectId = defaultProj.id;
      }
    } else {
      const defaultProj = await this.getOrCreateDefaultProject();
      targetProjectId = defaultProj.id;
    }

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'TODO',
        priority: data.priority ?? 'NO_PRIORITY',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        projectId: targetProjectId,
      },
      include: {
        project: true,
        members: {
          include: { user: true },
        },
        subtasks: true,
        comments: {
          include: { user: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
      include: {
        project: true,
        members: {
          include: { user: true },
        },
        subtasks: true,
        comments: {
          include: { user: true },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}