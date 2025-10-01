import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(201).json(users);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
