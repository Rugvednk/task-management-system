import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateDefaultWorkspace() {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: { name: 'Pyramid Workspace' },
      });
    }
    return workspace;
  }

  async create(data: Partial<CreateProjectDto> & { name: string; workspaceId?: string }) {
    let targetWorkspaceId = data.workspaceId;

    if (targetWorkspaceId) {
      const exists = await this.prisma.workspace.findUnique({
        where: { id: targetWorkspaceId },
      });
      if (!exists) {
        const ws = await this.getOrCreateDefaultWorkspace();
        targetWorkspaceId = ws.id;
      }
    } else {
      const ws = await this.getOrCreateDefaultWorkspace();
      targetWorkspaceId = ws.id;
    }

    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        priority: data.priority ?? 'NO_PRIORITY',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        workspaceId: targetWorkspaceId,
        leadId: data.leadId,
      },
      include: {
        lead: true,
        tasks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: true,
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
        tasks: {
          include: {
            members: { include: { user: true } },
            subtasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
      include: {
        lead: true,
        tasks: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}