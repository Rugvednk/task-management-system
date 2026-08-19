import { IsString } from 'class-validator';

export class CreateTaskMemberDto {
  @IsString()
  taskId!: string;

  @IsString()
  userId!: string;
}