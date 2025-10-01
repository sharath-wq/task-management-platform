import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskService } from '../services/task.service';
import { BadRequestError, NotFoundError } from '@backend/error-handler';

export const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(`Validation failed: ${JSON.stringify(errors.array())}`, 'createTask');

  try {
    const task = await TaskService.createTask(req.body);
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const bulkCreateTasks = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(`Validation failed: ${JSON.stringify(errors.array())}`, 'bulkCreateTasks');

  try {
    const tasks = await TaskService.bulkCreate(req.body.tasks);
    return res.status(201).json(tasks);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const result = await TaskService.getTasks(req.query);
    return res.json(result);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await TaskService.getTaskDetailsById(id);
    if (!task) throw new NotFoundError('Task not found', 'getTaskById');
    return res.json(task);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError(`Validation failed: ${JSON.stringify(errors.array())}`, 'bulkCreateTasks');
  const { id } = req.params;
  try {
    const updated = await TaskService.updateTask(id, req.body);
    if (!updated) throw new NotFoundError('Task not found', 'updateTask');
    return res.json(updated);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await TaskService.deleteTask(id);
    if (!deleted) throw new NotFoundError('Task not found', 'deleteTask');
    return res.json(deleted);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
