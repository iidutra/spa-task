import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import taskRoutes from './routes/taskRoutes';
import tagRoutes from './routes/tagRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/tags', authMiddleware, tagRoutes )

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
