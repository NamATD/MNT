import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: string[];

  @Prop({ type: String, required: false })
  projectId?: string;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  progress: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
