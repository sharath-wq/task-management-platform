import { Router } from 'express';
import { param } from 'express-validator';
import multer from 'multer';
import * as fileController from '../controllers/file.controller';
import authMiddleware from '@backend/middlewares/auth.middleware';
import { BadRequestError } from '@backend/error-handler';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.', 'MulterError'));
    }
  }
});

export function fileRoutes(): Router {
  const router = Router();

  router.post(
    '/:taskId/upload',
    [param('taskId').isMongoId().withMessage('Invalid task ID'), upload.array('files', 10)],
    authMiddleware,
    fileController.uploadFiles
  );

  router.get('/:fileId', [param('fileId').isMongoId().withMessage('Invalid file ID')], fileController.getFile);

  router.delete('/:fileId', [param('fileId').isMongoId().withMessage('Invalid file ID')], authMiddleware, fileController.deleteFile);

  return router;
}
