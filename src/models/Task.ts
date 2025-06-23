import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  assignedTo: string;
  projectId?: string;
  file?: string;
  progress: number;
  createdBy: string;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: String },
  file: { type: String },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<ITask>('Task', TaskSchema);