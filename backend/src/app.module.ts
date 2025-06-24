import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [
    TaskModule,
    MongooseModule.forRoot('mongodb://localhost:27017/task_manager'),
    ProjectModule,
    UserModule,
    
  ],
  controllers: [],
  providers: [ChatGateway,],
})
export class AppModule {}
