import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { BadRequestError } from '@backend/error-handler';
import { validationResult } from 'express-validator';

export const getTaskOverview = async (_req: Request, res: Response) => {
  try {
    const stats = await AnalyticsService.getTaskOverview();
    return res.json(stats);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserPerformance = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(JSON.stringify(errors.array()), 'getUserPerformance');

  const userId = req.query.userId as string | undefined;
  try {
    const metrics = await AnalyticsService.getUserPerformance(userId);
    return res.json(metrics);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getTaskTrends = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(JSON.stringify(errors.array()), 'getTaskTrends');

  const { from, to, interval = 'day' } = req.query;
  try {
    const trends = await AnalyticsService.getTaskTrends(from as string, to as string, interval as string);
    return res.json(trends);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const exportTasks = async (_req: Request, res: Response) => {
  try {
    const csvData = await AnalyticsService.exportTasks();
    res.header('Content-Type', 'text/csv');
    res.attachment('tasks_export.csv');
    return res.send(csvData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
