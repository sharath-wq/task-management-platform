import { Router } from 'express';
import { body, param } from 'express-validator';
import * as commentController from '../controllers/comment.controller';

export function commentRoutes(): Router {
  const router = Router();

  router.post(
    '/:taskId',
    [
      param('taskId').isMongoId().withMessage('Invalid task ID'),
      body('content').notEmpty().withMessage('Content is required'),
      body('userId').isMongoId().withMessage('Invalid user ID')
    ],
    commentController.addComment
  );

  router.get('/:taskId', [param('taskId').isMongoId().withMessage('Invalid task ID')], commentController.getCommentsByTask);

  router.put(
    '/:commentId',
    [param('commentId').isMongoId().withMessage('Invalid comment ID'), body('content').notEmpty().withMessage('Content is required')],
    commentController.updateComment
  );

  router.delete('/:commentId', [param('commentId').isMongoId().withMessage('Invalid comment ID')], commentController.deleteComment);

  return router;
}
