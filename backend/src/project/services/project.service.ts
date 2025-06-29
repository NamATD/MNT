import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class ProjectService {
  private readonly logger = new AppLogger(ProjectService.name);
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly userService: UserService,
  ) {}
  async createProject(userId: string, createProjectDto: CreateProjectDto) {
    try {
      const createdProject = new this.projectModel({
        ...createProjectDto,
        members: [userId],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: userId,
      });

      return await createdProject.save();
    } catch (error) {
      this.logger.logError(error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async getProject(projectId: string): Promise<Project> {
    try {
      const project = await this.projectModel.findById(projectId).lean();
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } catch (error) {
      console.log('[PROJECT] error: ', error);
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const projects = await this.projectModel.find({
        members: userId,
      });

      return projects;
    } catch (error) {
      console.error('[PROJECT] error:', error);
      throw new InternalServerErrorException('Failed to get user projects');
    }
  }

  async updateProject(projectId: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      if (updateProjectDto.userId !== project.createdBy.toString()) {
        throw new ForbiddenException(
          'You are not allowed to update this project',
        );
      }
      const updatedProject = await this.projectModel.findByIdAndUpdate(
        projectId,
        {
          title: updateProjectDto.title,
          description: updateProjectDto.description,
          members: updateProjectDto.member,
          updatedAt: Date.now(),
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return updatedProject;
    } catch (error) {
      console.log('[PROJECT] error: ', error);
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  async deleteProject(projectId: string, userId: string) {
    try {
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (userId !== project.createdBy.toString()) {
        throw new ForbiddenException(
          'You are not allowed to delete this project',
        );
      }

      const result = await this.projectModel.deleteOne({ _id: project._id });

      if (result.deletedCount === 1) {
        return {
          status: 'success',
          message: 'Project deleted',
        };
      } else {
        throw new InternalServerErrorException('Delete operation failed');
      }
    } catch (error) {
      console.error('[PROJECT] delete error:', error);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }
}
