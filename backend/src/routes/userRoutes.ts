import { Router } from 'express';
import { registerUser } from '../controllers/UserController';

const router = Router();

router.post('/register', registerUser);

export default router;
