import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Failed to authenticate token' });
        return;
      }
      if (typeof decoded === 'object' && decoded !== null) {
        req.user = decoded as JwtPayload; 
        next();
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
