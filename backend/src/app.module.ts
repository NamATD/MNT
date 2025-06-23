import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthModule, TaskModule,
    MongooseModule.forRoot('mongodb://localhost:27017/task_manager')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
