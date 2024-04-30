import { Router } from 'express';
import * as TaskController from '../controllers/TaskController';

const router = Router();

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTaskController);
router.get('/search', TaskController.searchTasksByTitleController);
router.put('/:id', TaskController.updateTaskController);
router.delete('/:id', TaskController.deleteTaskController);

export default router;