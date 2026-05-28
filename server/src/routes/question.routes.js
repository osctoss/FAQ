import { Router } from 'express';
import { createQuestion, getUserQuestions, updateStatus, markResolved } from '../controllers/question.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireNotRestricted } from '../middleware/qp.middleware.js';

const router = Router();
router.post('/', authenticate, requireNotRestricted, createQuestion);
router.get('/user/:userId', authenticate, getUserQuestions);
router.patch('/status/:id', authenticate, updateStatus);
router.patch('/resolve/:id', authenticate, markResolved);

export default router;