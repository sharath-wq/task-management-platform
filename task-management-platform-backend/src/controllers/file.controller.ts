import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { FileService } from '../services/file.service';
import { BadRequestError, NotFoundError } from '@backend/error-handler';
import fs from 'fs';

export const uploadFiles = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(JSON.stringify(errors.array()), 'uploadFiles');

  try {
    const taskId = req.params.taskId;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError('No files uploaded', 'uploadFiles');
    }

    const uploaded = await FileService.uploadFiles(taskId, files, (req as any).userId);
    return res.status(201).json(uploaded);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  try {
    const file = await FileService.getFile(fileId);
    if (!file) throw new NotFoundError('File not found', 'getFile');

    const filePath = FileService.getFilePath(file);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File not found on server', 'getFile');
    }

    return res.download(filePath, file.filename);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  try {
    const deleted = await FileService.deleteFile(fileId);
    if (!deleted) throw new NotFoundError('File not found', 'deleteFile');
    return res.json(deleted);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
