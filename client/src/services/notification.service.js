import api from './api';

const notificationService = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/read/${id}`),
  unreadCount: () => api.get('/notifications/unread-count'),
};

export default notificationService;