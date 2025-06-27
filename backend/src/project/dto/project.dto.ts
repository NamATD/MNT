import { IsArray, IsMongoId, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateProjectDto {
  @IsMongoId()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  member: string[];
}
