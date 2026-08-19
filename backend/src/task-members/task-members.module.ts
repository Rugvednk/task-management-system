import { Module } from '@nestjs/common';
import { TaskMembersController } from './task-members.controller';
import { TaskMembersService } from './task-members.service';

@Module({
  controllers: [TaskMembersController],
  providers: [TaskMembersService]
})
export class TaskMembersModule {}
