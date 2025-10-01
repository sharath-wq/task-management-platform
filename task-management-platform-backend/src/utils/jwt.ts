import { config } from '@backend/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = config.JWT_TOKEN!;
const JWT_EXPIRES_IN = '1h';

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
}
