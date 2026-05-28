import { Router } from 'express';
import { getPendingUsers, approveUser, assignRole, rejectUser } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();
router.get('/pending-users', authenticate, authorizeRoles('admin', 'senior'), getPendingUsers);
router.post('/approve-user', authenticate, authorizeRoles('admin', 'senior'), approveUser);
router.patch('/assign-role', authenticate, authorizeRoles('admin'), assignRole);
router.post('/reject-user', authenticate, authorizeRoles('admin', 'senior'), rejectUser);

export default router;