import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TaskMembersService } from './task-members.service';
import { CreateTaskMemberDto } from './dto/create-task-member.dto';

@Controller('task-members')
export class TaskMembersController {
  constructor(
    private readonly taskMembersService: TaskMembersService,
  ) {}

  @Get()
  findAll(@Query('taskId') taskId?: string) {
    return this.taskMembersService.findAll(taskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskMembersService.findOne(id);
  }

  @Post()
  create(@Body() createTaskMemberDto: CreateTaskMemberDto) {
    return this.taskMembersService.create(createTaskMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskMembersService.remove(id);
  }
}