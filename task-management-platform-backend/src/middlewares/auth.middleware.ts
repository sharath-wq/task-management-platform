import { config } from '@backend/config';
import { NotAuthorizedError } from '@backend/error-handler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = config.JWT_TOKEN || 'some-very-secret-key';

export default function (req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new NotAuthorizedError('Not authorized', 'auth/middleware');

  const parts = authHeader.split(' ');
  if (parts.length !== 2) throw new NotAuthorizedError('Not authorized', 'auth/middleware');

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) throw new NotAuthorizedError('Not authorized', 'auth/middleware');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = payload.id;
    return next();
  } catch (err) {
    throw err;
  }
}
