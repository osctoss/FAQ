import { Router } from 'express';
import {
  getUsers, getUser, addUser, updateUser, deleteUser,
  assignRole, blockUser, unblockUser, reactivateUser,
  getPendingUsers, approveUser, rejectUser,
  getRoleRequests, approveRoleRequest, rejectRoleRequest,
  bulkImportFAQs
} from '../controllers/admin.controller.js';
import {
  getWhitelist, addToWhitelist, removeFromWhitelist,
  getAccessRequests, approveAccessRequest, rejectAccessRequest
} from '../controllers/admin.whitelist.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/users', authorizeRoles('admin'), getUsers);
router.get('/users/:id', authorizeRoles('admin'), getUser);
router.post('/users', authorizeRoles('admin'), addUser);
router.patch('/users/:id', authorizeRoles('admin'), updateUser);
router.delete('/users/:id', authorizeRoles('admin'), deleteUser);

router.patch('/users/:id/role', authorizeRoles('admin'), assignRole);
router.patch('/assign-role', authorizeRoles('admin'), assignRole);
router.patch('/users/:id/block', authorizeRoles('admin'), blockUser);
router.patch('/users/:id/unblock', authorizeRoles('admin'), unblockUser);
router.post('/reactivate', authorizeRoles('admin'), reactivateUser);

router.get('/pending-users', authorizeRoles('admin', 'senior'), getPendingUsers);
router.post('/approve-user', authorizeRoles('admin', 'senior'), approveUser);
router.post('/reject-user', authorizeRoles('admin', 'senior'), rejectUser);

router.get('/role-requests', authorizeRoles('admin'), getRoleRequests);
router.post('/role-requests/:requestId/approve', authorizeRoles('admin'), approveRoleRequest);
router.post('/role-requests/:requestId/reject', authorizeRoles('admin'), rejectRoleRequest);

router.get('/whitelist', authorizeRoles('admin'), getWhitelist);
router.post('/whitelist', authorizeRoles('admin'), addToWhitelist);
router.delete('/whitelist/:id', authorizeRoles('admin'), removeFromWhitelist);

router.get('/access-requests', authorizeRoles('admin'), getAccessRequests);
router.post('/access-requests/:requestId/approve', authorizeRoles('admin'), approveAccessRequest);
router.post('/access-requests/:requestId/reject', authorizeRoles('admin'), rejectAccessRequest);

export default router;