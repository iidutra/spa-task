import { Request, Response } from 'express';
import { loginUser } from '../services/AuthService';

export const loginUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await loginUser(req.body.username, req.body.password);
    res.status(200).json({ message: 'User successfully logged in', token });
  } catch (error) {
    const err = error as { message: string }; 
    res.status(401).json({ message: err.message });
  }
};
