import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, JwtPayload } from 'src/auth/decorators/auth.decorator';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
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
  async getProjects(@Auth() auth: JwtPayload) {
    return await this.projectService.getProjectsByUser(auth._id);
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
    @Auth() auth: JwtPayload,
  ) {
    return this.projectService.deleteProject(projectId, auth._id);
  }
}
