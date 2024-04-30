import User, { IUser } from '../models/User';

export const createUser = async (userData: IUser): Promise<IUser> => {
  const user = new User(userData);
  return user.save();
};
