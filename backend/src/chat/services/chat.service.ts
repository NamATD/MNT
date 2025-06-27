import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { ProjectService } from '../../project/services/project.service';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class ChatService {
  private readonly logger = new AppLogger(ChatService.name);
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private projectService: ProjectService,
  ) {}

  async createMessage(
    content: string,
    senderId: string,
    projectId: string,
  ): Promise<Message> {
    try {
      await this.projectService.getProject(projectId);

      const newMessage = new this.messageModel({
        content,
        sender: senderId,
        project: projectId,
      });

      return await newMessage.save();
    } catch (error) {
      this.logger.logError(error);
      throw new InternalServerErrorException();
    }
  }

  async getProjectMessages(
    projectId: string,
    userId: string,
    limit = 50,
  ): Promise<Message[]> {
    try {
      const id = new Types.ObjectId(userId);

      const project = await this.projectService.getProject(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Check userId included in project
      const exists = project.members.some((m) => m.equals(id));
      if (!exists) {
        throw new ForbiddenException();
      }

      return this.messageModel
        .find({ project: projectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('sender', 'username')
        .lean();
    } catch (error) {
      this.logger.logError(error);
      throw new InternalServerErrorException();
    }
  }
}
