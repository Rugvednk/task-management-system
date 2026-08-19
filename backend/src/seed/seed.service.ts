import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    // 1. Create or get default workspace
    let workspace = await this.prisma.workspace.findFirst({
      where: { name: 'Pyramid Workspace' },
    });

    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: {
          name: 'Pyramid Workspace',
        },
      });
    }

    // 2. Create default users
    const dexterData = {
      email: 'dexter@pyramid.com',
      username: 'dexter',
      fullName: 'Dexter',
      title: 'Product Designer',
    };

    let dexter = await this.prisma.user.findUnique({
      where: { email: dexterData.email },
    });

    if (!dexter) {
      dexter = await this.prisma.user.create({ data: dexterData });
    }

    const sarahData = {
      email: 'sarah@pyramid.com',
      username: 'sarah',
      fullName: 'Sarah Miller',
      title: 'Frontend Engineer',
    };

    let sarah = await this.prisma.user.findUnique({
      where: { email: sarahData.email },
    });

    if (!sarah) {
      sarah = await this.prisma.user.create({ data: sarahData });
    }

    const alexData = {
      email: 'alex@pyramid.com',
      username: 'alex',
      fullName: 'Alex Chen',
      title: 'Backend Engineer',
    };

    let alex = await this.prisma.user.findUnique({
      where: { email: alexData.email },
    });

    if (!alex) {
      alex = await this.prisma.user.create({ data: alexData });
    }

    // Ensure Workspace Member
    const memberExists = await this.prisma.workspaceMember.findFirst({
      where: { userId: dexter.id, workspaceId: workspace.id },
    });

    if (!memberExists) {
      await this.prisma.workspaceMember.create({
        data: {
          userId: dexter.id,
          workspaceId: workspace.id,
          role: 'ADMIN',
        },
      });
    }

    // 3. Create Default Project
    let project = await this.prisma.project.findFirst({
      where: { workspaceId: workspace.id },
    });

    if (!project) {
      project = await this.prisma.project.create({
        data: {
          name: 'Pyramid Assessment Project',
          description: 'Main project for managing tasks and system workflow.',
          workspaceId: workspace.id,
          leadId: dexter.id,
          priority: 'HIGH',
        },
      });
    }

    // 4. Check existing tasks
    const taskCount = await this.prisma.task.count({
      where: { projectId: project.id },
    });

    if (taskCount === 0) {
      // Task 1: Design System Updates
      await this.prisma.task.create({
        data: {
          title: 'Design System Updates',
          description: 'Refine theme tokens, color mode palettes, and component styles matching Figma.',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          projectId: project.id,
          subtasks: {
            create: [
              { title: 'Define color mode tokens (amber, blue, pink, rose, emerald)', completed: true },
              { title: 'Create button component specs & variants', completed: false },
              { title: 'Review typography scale & spacing parameters', completed: false },
            ],
          },
          members: {
            create: [
              { userId: dexter.id },
              { userId: sarah.id },
            ],
          },
          comments: {
            create: [
              {
                content: 'Make sure the theme persistence works across page refreshes seamlessly!',
                userId: sarah.id,
              },
            ],
          },
        },
      });

      // Task 2: API Integration & Validation
      await this.prisma.task.create({
        data: {
          title: 'API Integration & NestJS Validation',
          description: 'Set up clean REST endpoints in NestJS with DTO validation pipes and Prisma models.',
          status: 'DOING',
          priority: 'URGENT',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          projectId: project.id,
          subtasks: {
            create: [
              { title: 'Setup NestJS global validation pipes', completed: true },
              { title: 'Implement Task, Subtask, Comment endpoints', completed: true },
              { title: 'Enable Guest Login seeding route', completed: false },
            ],
          },
          members: {
            create: [
              { userId: alex.id },
              { userId: dexter.id },
            ],
          },
          comments: {
            create: [
              {
                content: 'All endpoints are matching the schema definition now.',
                userId: alex.id,
              },
            ],
          },
        },
      });

      // Task 3: Theme Persistence Implementation
      await this.prisma.task.create({
        data: {
          title: 'Theme Persistence Implementation',
          description: 'Persist theme selection in localStorage and synchronize with HTML data attributes.',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          projectId: project.id,
          subtasks: {
            create: [
              { title: 'Create ThemeProvider component', completed: true },
              { title: 'Connect ThemeMenu dropdown to state', completed: true },
            ],
          },
          members: {
            create: [
              { userId: dexter.id },
            ],
          },
        },
      });

      // Task 4: Mobile Responsiveness Polish
      await this.prisma.task.create({
        data: {
          title: 'Mobile Responsiveness Polish',
          description: 'Ensure header, navigation drawer, task lists, and Kanban columns work smoothly on smaller screens.',
          status: 'TODO',
          priority: 'LOW',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          projectId: project.id,
          subtasks: {
            create: [
              { title: 'Add responsive hamburger navigation', completed: false },
              { title: 'Adapt board columns horizontal scroll', completed: false },
            ],
          },
          members: {
            create: [
              { userId: sarah.id },
            ],
          },
        },
      });
    }

    return {
      message: 'Seed successful',
      workspace,
      project,
      user: dexter,
    };
  }
}
