import { Controller, Get, Post, Body, Param, Delete, Request, Put } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskProgressDto } from '../dto/task.dto';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() req,
    ) {
        return this.taskService.create(createTaskDto, req.user._id);
    }

    @Get()
    async findAll(@Request() req) {
        return this.taskService.findAll(req.user._id, req.user.role);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.taskService.findOne(id, req.user._id, req.user.role);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req,
    ) {
        return this.taskService.update(id, updateTaskDto, req.user._id, req.user.role);
    }

    @Put(':id/progress')
    async updateProgress(
        @Param('id') id: string,
        @Body() updateProgressDto: UpdateTaskProgressDto,
        @Request() req,
    ) {
        return this.taskService.updateProgress(id, updateProgressDto, req.user._id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        return this.taskService.remove(id, req.user._id, req.user.role);
    }
}