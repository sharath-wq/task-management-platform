import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { config } from '@backend/config';
import { BadRequestError, NotFoundError } from '@backend/error-handler';

const JWT_SECRET = config.JWT_TOKEN!;
const JWT_EXPIRES_IN = '1h';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError(`Validation failed ${JSON.stringify(errors.array())}`, 'register method in auth.controller.ts');

  const { email, password, name } = req.body;

  try {
    const existing = await User.findOne({ email });
    console.log(existing, 'existing user');
    if (existing) throw new BadRequestError('Email already in use', 'register method in auth.controller.ts');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashed, name });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError(`Validation failed ${JSON.stringify(errors.array())}`, 'login method in auth.controller.ts');

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User not found', 'login method in auth.controller.ts');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestError('Invalid credentials', 'login method in auth.controller.ts');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new NotFoundError('User not found', 'getMe method in auth.controller.ts');
    return res.json({ user });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
