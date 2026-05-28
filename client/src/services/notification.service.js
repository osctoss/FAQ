import api from './api';

const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/read/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default notificationService;