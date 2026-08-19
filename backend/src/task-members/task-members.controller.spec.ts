import { Test, TestingModule } from '@nestjs/testing';
import { TaskMembersController } from './task-members.controller';

describe('TaskMembersController', () => {
  let controller: TaskMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskMembersController],
    }).compile();

    controller = module.get<TaskMembersController>(TaskMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
