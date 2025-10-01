import { IComment } from '@backend/interface';
import { Comment } from '../models/comment.model';
import { Types } from 'mongoose';

export class CommentService {
  static async addComment(taskId: string, userId: string, content: string): Promise<IComment> {
    const comment = await Comment.create({
      task: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
      content
    });

    const newComment = await comment.populate('user', '_id name');

    return newComment;
  }

  static async getCommentsByTask(taskId: string): Promise<IComment[]> {
    return Comment.find({ task: taskId, is_deleted: false }).sort({ created_at: 1 });
  }

  static async updateComment(commentId: string, content: string): Promise<IComment | null> {
    return Comment.findOneAndUpdate({ _id: commentId, is_deleted: false }, { content }, { new: true });
  }

  static async deleteComment(commentId: string): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(commentId, { is_deleted: true }, { new: true });
  }
}
