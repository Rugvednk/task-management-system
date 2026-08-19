import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string }) {
    return this.prisma.workspace.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.workspace.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

async findOne(id: string) {
  const workspace = await this.prisma.workspace.findUnique({
    where: {
      id,
    },
  });

  if (!workspace) {
    throw new NotFoundException(`Workspace with ID ${id} not found`);
  }

  return workspace;
}

async update(id: string, data: UpdateWorkspaceDto) {
  return this.prisma.workspace.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
  });
}
async remove(id: string) {
  return this.prisma.workspace.delete({
    where: {
      id,
    },
  });
}
}