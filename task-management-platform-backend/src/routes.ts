import { Application } from 'express';
import { healthRoutes } from './routes/health.route';
import { authRoutes } from './routes/auth.route';
import { taskRoutes } from './routes/task.routes';
import { commentRoutes } from './routes/comment.routes';
import { fileRoutes } from './routes/file.route';
import { analyticsRoutes } from './routes/analytics.routes';
import authMiddleware from './middlewares/auth.middleware';
import { userRoutes } from './routes/user.routes';

const BASE_PATH = '/api/v1';

export function appRoutes(app: Application): void {
  app.use(BASE_PATH, healthRoutes());
  app.use(BASE_PATH + '/auth', authRoutes());
  app.use(BASE_PATH + '/users', authMiddleware, userRoutes());
  app.use(BASE_PATH + '/tasks', authMiddleware, taskRoutes());
  app.use(BASE_PATH + '/comments', authMiddleware, commentRoutes());
  app.use(BASE_PATH + '/files', fileRoutes());
  app.use(BASE_PATH + '/analytics', authMiddleware, analyticsRoutes());
}
