import { Router } from 'express';
import { query } from 'express-validator';
import * as analyticsController from '../controllers/analytics.controller';

export function analyticsRoutes(): Router {
  const router = Router();

  router.get('/tasks/overview', analyticsController.getTaskOverview);

  router.get(
    '/users/performance',
    [query('userId').optional().isMongoId().withMessage('Invalid user ID')],
    analyticsController.getUserPerformance
  );

  router.get(
    '/tasks/trends',
    [query('from').optional().isISO8601(), query('to').optional().isISO8601(), query('interval').optional().isIn(['day', 'week', 'month'])],
    analyticsController.getTaskTrends
  );

  router.get('/tasks/export', analyticsController.exportTasks);

  return router;
}
