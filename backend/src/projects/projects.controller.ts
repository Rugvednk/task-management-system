import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateProjectDto: UpdateProjectDto,
) {
  return this.projectsService.update(id, updateProjectDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.projectsService.remove(id);
}

@Post()
create(
  @Body()
  body: {
    name: string;
    description?: string;
    workspaceId: string;
  },
) {
  return this.projectsService.create(body);
}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}