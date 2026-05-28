import { Router } from 'express';
import {
  listRTQs, getRTQ, submitQuestion, addAnswer, upvoteAnswer,
  approveAnswer, markAccepted, removeRTQ, reportRTQ, convertToFAQ
} from '../controllers/rtq.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { requireNotRestricted } from '../middleware/qp.middleware.js';

const router = Router();

// ⚠️ Specific paths MUST come before /:id to avoid being captured as an ID param
router.get('/', authenticate, listRTQs);
router.post('/question', authenticate, authorizeRoles('student', 'moderator', 'senior'), requireNotRestricted, submitQuestion);
router.post('/answer/upvote/:answerId', authenticate, upvoteAnswer);

// Dynamic paths after
router.get('/:id', authenticate, getRTQ);
router.post('/:id/answer', authenticate, requireNotRestricted, addAnswer);
router.patch('/approve-answer/:answerId', authenticate, authorizeRoles('moderator', 'senior', 'admin'), approveAnswer);
router.patch('/mark-accepted/:id', authenticate, authorizeRoles('moderator', 'senior', 'admin'), markAccepted);
router.post('/convert/:id', authenticate, authorizeRoles('senior', 'admin'), convertToFAQ);
router.post('/report/:id', authenticate, reportRTQ);
router.delete('/:id', authenticate, authorizeRoles('senior', 'admin'), removeRTQ);

export default router;