import api from './api';

const adminService = {
  getPendingUsers: () => api.get('/admin/pending-users'),
  approveUser: (userId) => api.post('/admin/approve-user', { userId }),
  rejectUser: (userId) => api.post('/admin/reject-user', { userId }),
  assignRole: (data) => api.patch('/admin/assign-role', data),
};

export default adminService;