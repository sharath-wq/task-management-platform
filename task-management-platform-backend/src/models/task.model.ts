import { ITask } from '@backend/interface';
import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    due_date: { type: Date },
    tags: [{ type: String }],
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);
TaskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
