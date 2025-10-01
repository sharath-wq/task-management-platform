import { Router, Request, Response } from 'express';

export function healthRoutes(): Router {
  const router = Router();
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Health check ok' });
  });
  return router;
}
