import { IFile } from '@backend/interface';
import mongoose, { Schema } from 'mongoose';

const FileSchema = new Schema<IFile>(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    file_url: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: 'created_at' } }
);

export const File = mongoose.model<IFile>('File', FileSchema);
