import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('task/:taskId')
  findByTaskId(@Param('taskId') taskId: string) {
    return this.activityService.findByTaskId(taskId);
  }

  @Post()
  create(@Body() body: { action: string; details?: string; taskId: string; userId?: string }) {
    return this.activityService.create(body);
  }
}
