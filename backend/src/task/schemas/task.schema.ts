import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  assignedTo: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: String, enum: ['active', 'cancel', 'done'], default: 'active' })
  status: string;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ type: Date, required: false })
  dueDate: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
