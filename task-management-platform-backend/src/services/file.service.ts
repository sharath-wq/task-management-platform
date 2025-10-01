import { IFile } from '@backend/interface';
import { File } from '../models/file.model';
import { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';

export class FileService {
  static async uploadFiles(taskId: string, files: Express.Multer.File[], userId: string): Promise<IFile[]> {
    const docs = files.map((file) => ({
      task: new Types.ObjectId(taskId),
      uploaded_by: new Types.ObjectId(userId),
      filename: file.originalname,
      file_url: file.filename,
      mimetype: file.mimetype,
      size: file.size
    }));

    return File.insertMany(docs);
  }

  static async getFile(fileId: string): Promise<IFile | null> {
    return File.findOne({ _id: fileId, is_deleted: false });
  }

  static getFilePath(file: IFile): string {
    return path.join(process.cwd(), 'uploads', file.file_url);
  }

  static async deleteFile(fileId: string): Promise<IFile | null> {
    const file = await File.findById(fileId);
    if (!file) return null;

    const filePath = FileService.getFilePath(file);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await file.deleteOne();
    return file;
  }
}
