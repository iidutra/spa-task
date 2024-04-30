import { Router } from 'express';
import * as TagController from '../controllers/TagController';

const router = Router();

router.get('/', TagController.gettAllTags);
router.post('/', TagController.createTagController);
router.put('/:id', TagController.updateTagController);
router.delete('/:id', TagController.deleteTagController);

export default router;