import { Router } from 'express';
import { evaluate, rebuildVectors } from '../controllers/rag.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();
router.post('/evaluate-question', authenticate, evaluate);
router.post('/rebuild-vectors', authenticate, authorizeRoles('senior', 'admin'), rebuildVectors);

export default router;