import { Task } from '../models/task.model';
import { Parser } from 'json2csv';

export class AnalyticsService {
  static async getTaskOverview() {
    const statusStats = await Task.aggregate([{ $match: { is_deleted: false } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);

    const priorityStats = await Task.aggregate([{ $match: { is_deleted: false } }, { $group: { _id: '$priority', count: { $sum: 1 } } }]);

    return { statusStats, priorityStats };
  }

  static async getUserPerformance(userId?: string) {
    const match: any = { is_deleted: false };
    if (userId) match.assigned_to = userId;

    const totalTasks = await Task.countDocuments(match);
    const completed = await Task.countDocuments({ ...match, status: 'done' });
    const pending = await Task.countDocuments({ ...match, status: { $ne: 'done' } });

    return { totalTasks, completed, pending };
  }

  static async getTaskTrends(from?: string, to?: string, interval: string = 'day') {
    const match: any = { is_deleted: false };
    if (from || to) match.created_at = {};
    if (from) match.created_at.$gte = new Date(from);
    if (to) match.created_at.$lte = new Date(to);

    const groupFormat: any = {};
    switch (interval) {
      case 'day':
        groupFormat._id = { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } };
        break;
      case 'week':
        groupFormat._id = { $week: '$created_at' };
        break;
      case 'month':
        groupFormat._id = { $dateToString: { format: '%Y-%m', date: '$created_at' } };
        break;
    }

    const trends = await Task.aggregate([{ $match: match }, { $group: { ...groupFormat, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);

    return trends;
  }

  static async exportTasks() {
    const tasks = await Task.find({ is_deleted: false }).lean();
    const fields = ['_id', 'title', 'status', 'priority', 'due_date', 'assigned_to', 'created_at'];
    const parser = new Parser({ fields });
    return parser.parse(tasks);
  }
}
