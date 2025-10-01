import { IComment } from '@backend/interface';
import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema<IComment>(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
