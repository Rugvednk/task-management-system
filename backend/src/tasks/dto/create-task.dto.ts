import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority, TaskStatus } from '../../../generated/prisma/client';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsString()
  projectId!: string;
}