import { Body, Controller,Delete, Get, Param,Patch, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateWorkspaceDto: UpdateWorkspaceDto,
) {
  return this.workspacesService.update(id, updateWorkspaceDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.workspacesService.remove(id);
}

  @Post()
  create(@Body() body: { name: string }) {
    return this.workspacesService.create(body);
  }

  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }
}