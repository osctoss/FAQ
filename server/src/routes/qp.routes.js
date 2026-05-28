import { Router } from 'express';
import { getMyScore, getHistory, getLeaderboard } from '../controllers/qp.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/my-score', authenticate, getMyScore);
router.get('/history', authenticate, getHistory);
router.get('/leaderboard', authenticate, getLeaderboard);

export default router;