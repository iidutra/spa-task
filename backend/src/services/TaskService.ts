import Task, { ITask } from '../models/Task';

export const createTaskService = async (taskData: ITask): Promise<ITask> => {
  const task = new Task(taskData);
  return await task.save();
};

export const updateTaskService = async (taskId: string, taskData: ITask): Promise<ITask | null> => {
  const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true, runValidators: true });
  return task;
};

export const deleteTaskService = async (taskId: string): Promise<ITask | null> => {
  const task = await Task.findByIdAndDelete(taskId);
  return task;
};

export const searchTasksByTitleService = async (titleQuery: string): Promise<ITask[]> => {
  const tasks = await Task.find({ title: { $regex: new RegExp(titleQuery, 'i') } });
  return tasks;
};

export const getAllTasks = async (): Promise<ITask[]> => {
  const tasks = await Task.find().populate('tags', '-_id name');
  return tasks;
};