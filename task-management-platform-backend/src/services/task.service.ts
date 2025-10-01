import { ITask } from '@backend/interface';
import { Task } from '../models/task.model';
import { FilterQuery } from 'mongoose';
import { Comment } from '@backend/models/comment.model';
import { File } from '@backend/models/file.model';

export class TaskService {
  static async createTask(data: Partial<ITask>) {
    return Task.create(data);
  }

  static async bulkCreate(tasks: Partial<ITask>[]) {
    return Task.insertMany(tasks);
  }

  static async getTasks(query: any) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search,
      status,
      priority,
      assigned_to,
      tags,
      due_date
    } = query;

    const filters: FilterQuery<ITask> = { is_deleted: false };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assigned_to) filters.assigned_to = assigned_to;
    if (due_date) filters.due_date = { $lte: new Date(due_date) };
    if (tags) filters.tags = { $in: tags.split(',') };

    if (search) filters.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(filters)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filters);

    return {
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getTaskDetailsById(id: string) {
    const task = await Task.findOne({ _id: id, is_deleted: false }).populate('assigned_to', 'name');
    const comments = await Comment.find({ task: id, is_deleted: false }).populate('user', 'name');
    const files = await File.find({ task: id, is_deleted: false });

    return { ...task?.toObject(), comments, files };
  }

  static async updateTask(id: string, data: Partial<ITask>) {
    return Task.findOneAndUpdate({ _id: id, is_deleted: false }, data, {
      new: true
    });
  }

  static async deleteTask(id: string) {
    return Task.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
  }
}
