import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TaskModule,
    MongooseModule.forRoot('mongodb://localhost:27017/task_manager'),
    ProjectModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
