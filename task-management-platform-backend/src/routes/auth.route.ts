import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

export function authRoutes(): Router {
  const router = Router();

  router.post(
    '/register',
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
    ],
    authController.register
  );

  router.post(
    '/login',
    [body('email').isEmail().withMessage('Invalid email'), body('password').exists().withMessage('Password is required')],
    authController.login
  );

  router.get('/me', authMiddleware, authController.getMe);

  return router;
}
