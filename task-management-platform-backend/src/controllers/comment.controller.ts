import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CommentService } from '../services/comment.service';
import { BadRequestError, NotFoundError } from '@backend/error-handler';

export const addComment = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(`Validation failed: ${JSON.stringify(errors.array())}`, 'addComment');

  try {
    const comment = await CommentService.addComment(req.params.taskId, req.body.userId, req.body.content);
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCommentsByTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const comments = await CommentService.getCommentsByTask(taskId);
    return res.json(comments);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(`Validation failed: ${JSON.stringify(errors.array())}`, 'updateComment');

  try {
    const updated = await CommentService.updateComment(commentId, req.body.content);
    if (!updated) throw new NotFoundError('Comment not found', 'updateComment');
    return res.json(updated);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  try {
    const deleted = await CommentService.deleteComment(commentId);
    if (!deleted) throw new NotFoundError('Comment not found', 'deleteComment');
    return res.json(deleted);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
