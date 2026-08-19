import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { UsersModule } from './users/users.module';
import { TaskMembersModule } from './task-members/task-members.module';
import { SeedModule } from './seed/seed.module';
import { CommentsModule } from './comments/comments.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    PrismaModule,
    TasksModule,
    ProjectsModule,
    WorkspacesModule,
    SubtasksModule,
    UsersModule,
    TaskMembersModule,
    SeedModule,
    CommentsModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
