import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task, TaskDocument } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  /**
   * Create a new task in a project
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    try {
      const task = new this.taskModel({
        ...createTaskDto,
        status: 'active',
        progress: 0,
      });

      return await task.save();
    } catch (error) {
      console.error(`[TaskService] Create task error:`, error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  /**
   * Get all tasks by project
   */
  async findByProject(projectId: string): Promise<TaskDocument[]> {
    try {
      const tasks = await this.taskModel.find({ projectId });

      if (!tasks || tasks.length === 0) {
        throw new NotFoundException('No tasks found for this project');
      }

      return tasks;
    } catch (error) {
      console.error(`[TaskService] Find all tasks error:`, error);
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  /**
   * Get a specific task by ID
   */
  async findOne(taskId: string): Promise<TaskDocument> {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new BadRequestException('Invalid task ID');
      }

      const task = await this.taskModel.findById(taskId).lean();

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      return task;
    } catch (error) {
      console.error(`[TaskService] Find one task error:`, error);
      throw new InternalServerErrorException('Failed to fetch task');
    }
  }

  /**
   * Update a task
   */
  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    try {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new BadRequestException('Invalid task ID');
      }

      const task = await this.taskModel.findById(taskId);

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      // Update the task
      Object.assign(task, updateTaskDto);
      return await task.save();
    } catch (error) {
      console.error(`[TaskService] Update task error:`, error);
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  /**
   * Delete a task
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid task ID');
      }

      const task = await this.taskModel.findById(id);

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await this.taskModel.findByIdAndDelete(id);
      return { deleted: true };
    } catch (error) {
      console.error(`[TaskService] Delete task error:`, error);
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
