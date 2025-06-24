import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from '../gateways/chat.gateway';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ChatGateway],
  exports: [ProjectService],
})
export class ProjectModule {}
