import { Router } from 'express';
import {
  listRTQs, getRTQ, submitQuestion, addAnswer, upvoteAnswer,
  approveAnswer, markAccepted, removeRTQ, reportRTQ, convertToFAQ
} from '../controllers/rtq.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { requireNotRestricted } from '../middleware/qp.middleware.js';

const router = Router();

router.get('/', authenticate, listRTQs);
router.get('/:id', authenticate, getRTQ);

// Submit question — student/moderator (with restriction check)
router.post('/question', authenticate, authorizeRoles('student', 'moderator', 'senior'), requireNotRestricted, submitQuestion);

// Add answer — any authenticated user
router.post('/:id/answer', authenticate, requireNotRestricted, addAnswer);

// Upvote answer
router.post('/answer/upvote/:answerId', authenticate, upvoteAnswer);

// Approve answer — moderator/senior
router.patch('/approve-answer/:answerId', authenticate, authorizeRoles('moderator', 'senior', 'admin'), approveAnswer);

// Mark question accepted — moderator/senior
router.patch('/mark-accepted/:id', authenticate, authorizeRoles('moderator', 'senior', 'admin'), markAccepted);

// Convert RTQ to FAQ — senior only
router.post('/convert/:id', authenticate, authorizeRoles('senior', 'admin'), convertToFAQ);

// Report
router.post('/report/:id', authenticate, reportRTQ);

// Remove RTQ — senior only
router.delete('/:id', authenticate, authorizeRoles('senior', 'admin'), removeRTQ);

export default router;