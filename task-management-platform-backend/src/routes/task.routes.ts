import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as taskController from '../controllers/task.controller';

export function taskRoutes(): Router {
  const router = Router();

  router.post(
    '/',
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
      body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
    ],
    taskController.createTask
  );

  router.post('/bulk', [body('tasks').isArray({ min: 1 }).withMessage('Tasks must be an array')], taskController.bulkCreateTasks);

  router.get(
    '/',
    [
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1 }),
      query('sortBy').optional().isString(),
      query('sortOrder').optional().isIn(['asc', 'desc'])
    ],
    taskController.getTasks
  );

  router.get('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], taskController.getTaskById);

  router.put(
    '/:id',
    [
      param('id').isMongoId().withMessage('Invalid task ID'),
      body('status').optional().isIn(['todo', 'in-progress', 'done']),
      body('priority').optional().isIn(['low', 'medium', 'high'])
    ],
    taskController.updateTask
  );

  router.delete('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], taskController.deleteTask);

  return router;
}
