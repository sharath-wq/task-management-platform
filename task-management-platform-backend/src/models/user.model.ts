import { IUser } from '@backend/interface';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default model<IUser>('User', userSchema);
