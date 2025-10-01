import { getUsers } from '@backend/controllers/user.controller';
import authMiddleware from '@backend/middlewares/auth.middleware';
import { Router } from 'express';

export function userRoutes(): Router {
  const router = Router();

  router.get('/', authMiddleware, getUsers);

  return router;
}
