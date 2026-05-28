import api from './api';

const userService = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.patch('/users/password', data),
  assignRole: (id, data) => api.patch('/admin/assign-role', { userId: id, ...data }),
  restrictUser: (id) => api.patch('/users/restrict/:id'.replace(':id', id)),
  removeUser: (id) => api.delete('/users/:id'.replace(':id', id)),
  leaderboard: () => api.get('/leaderboard'),
  pendingUsers: () => api.get('/admin/pending-users'),
  approveUser: (id) => api.post('/admin/approve-user', { userId: id }),
};

export default userService;