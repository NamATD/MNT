import { IsString, IsOptional, IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsMongoId()
    assignedTo: string;

    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsString()
    file?: string;
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsMongoId()
    assignedTo?: string;

    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsString()
    file?: string;
}

export class UpdateTaskProgressDto {
    @IsNumber()
    @Min(0)
    @Max(100)
    progress: number;
}