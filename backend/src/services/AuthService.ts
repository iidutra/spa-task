import User from '../models/User';
import jwt from 'jsonwebtoken';

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return token;
};
