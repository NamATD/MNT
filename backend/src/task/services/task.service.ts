import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Task, TaskDocument } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskProgressDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    ) { }

    /**
     * Create a new task
     */
    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const createdTask = new this.taskModel({
            ...createTaskDto,
            createdBy: userId,
            progress: 0
        });
        return createdTask.save();
    }

    /**
     * Get all tasks based on user role and ID
     */
    async findAll(): Promise<Task[]> {
        /* // Admin can see all tasks
        if (userRole === 'admin') {
            return this.taskModel.find()
                .populate('assignedTo', 'username')
                .populate('createdBy', 'username')
                .exec();
        }
        
        // Leader can see tasks they created
        if (userRole === 'leader') {
            return this.taskModel.find({ createdBy: userId })
                .populate('assignedTo', 'username')
                .populate('createdBy', 'username')
                .exec();
        }
        
        // Normal employees can see tasks assigned to them
        return this.taskModel.find({ assignedTo: userId })
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .exec(); */

        return this.taskModel.find();
    }

    /**
     * Get a single task by ID
     */
    async findOne(id: string, userId: string, userRole: string): Promise<Task> {
        const task = await this.taskModel.findById(id)
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .exec();

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Check if user has permission to view this task
        if (userRole !== 'admin' &&
            task.createdBy.toString() !== userId &&
            task.assignedTo.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to view this task');
        }

        return task;
    }

    /**
     * Update a task
     */
    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string, userRole: string): Promise<Task> {
        const task = await this.taskModel.findById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Only admin or the task creator can update tasks
        if (userRole !== 'admin' && task.createdBy.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to update this task');
        }

        const updatedTask = await this.taskModel.findByIdAndUpdate(
            id,
            updateTaskDto,
            { new: true }
        ).exec();

        if (!updatedTask) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return updatedTask;
    }

    /**
     * Update task progress
     */
    async updateProgress(id: string, updateProgressDto: UpdateTaskProgressDto, userId: string): Promise<Task> {
        const task = await this.taskModel.findById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Only the assigned user can update progress
        if (task.assignedTo.toString() !== userId) {
            throw new ForbiddenException('Only the assigned user can update task progress');
        }

        // Validate progress range
        if (updateProgressDto.progress < 0 || updateProgressDto.progress > 100) {
            throw new ForbiddenException('Progress must be between 0 and 100');
        }

        task.progress = updateProgressDto.progress;
        return task.save();
    }

    /**
     * Delete a task
     */
    async remove(id: string, userId: string, userRole: string): Promise<Task> {
        const task = await this.taskModel.findById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Only admin or the task creator can delete tasks
        if (userRole !== 'admin' && task.createdBy.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
        if (!deletedTask) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return deletedTask;
    }
}