import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from '../../../generated/prisma/client';

export class CreateSubtaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsString()
  taskId!: string;
}