import { Request, Response } from 'express';
import * as TaskService from '../services/TaskService';

interface ErrorResponse {
    message: string;
    [key: string]: any; 
  }
  
  export async function createTaskController(req: Request, res: Response): Promise<void> {
    try {
        const task = await TaskService.createTaskService(req.body);
        res.status(201).json(task);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({ error: err.message });
    }
  }
  
  export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskService.updateTaskService(req.params.id, req.body);
      if (!task) {
          res.status(404).json({ message: 'Task not found' });
          return;
      }
        res.status(200).json(task);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({ error: err.message });
    }
  };
  
  export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskService.deleteTaskService(req.params.id);
      if (!task) {
          res.status(404).json({ message: 'Task not found' });
          return;
      }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({ error: err.message });
    }
  };
  
  export const searchTasksByTitleController = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await TaskService.searchTasksByTitleService(req.query.title as string);
        res.status(200).json(tasks);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(400).json({ error: err.message });
    }
  };

  export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tag = await TaskService.getAllTasks();
        res.status(200).json(tag);
    } catch (error) {
        const err = error as ErrorResponse;
        res.status(404).json({ error: err.message });
    }
  };
  