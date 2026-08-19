import { Test, TestingModule } from '@nestjs/testing';
import { TaskMembersService } from './task-members.service';

describe('TaskMembersService', () => {
  let service: TaskMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskMembersService],
    }).compile();

    service = module.get<TaskMembersService>(TaskMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
