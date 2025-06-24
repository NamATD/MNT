import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get(':id')
  async getProject(@Param('id') projectId: string) {
    return this.projectService.getProject(projectId);
  }

  @Post()
  async getProjects(@Body() body: { userId: string }) {
    return await this.projectService.getProjectsByUser(body.userId);
  }

  @Put(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() updateData: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(projectId, updateData);
  }

  @Delete(':id')
  async deleteProject(
    @Param('id') projectId: string,
    @Body() body: { userId: string },
  ) {
    return this.projectService.deleteProject(projectId, body.userId);
  }
}
