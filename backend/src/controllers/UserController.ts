import { Request, Response } from 'express';
import { createUser } from '../services/UserService';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User successfully created', user });
  } catch (error) {
    const err = error as { message: string }; 
    res.status(500).json({ message: err.message });
  }
};
