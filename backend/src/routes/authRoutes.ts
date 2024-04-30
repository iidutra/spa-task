import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; 

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send('User not found.');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send('Incorrect password.');
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      
      res.json({ token });
    } catch (error) {
      res.status(500).send('Error logging in.');
    }
  });
  
  export default router;