import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  tags?: string[];
  assigned_to?: Types.ObjectId;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IComment extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IFile extends Document {
  task: Types.ObjectId;
  uploaded_by: Types.ObjectId;
  filename: string;
  file_url: string;
  mimetype: string;
  size: number;
  is_deleted: boolean;
  created_at: Date;
}
