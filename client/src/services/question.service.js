import api from './api';

const questionService = {
  create: (data) => api.post('/questions', data),
  getUserQuestions: (userId) => api.get(`/questions/user/${userId}`),
  updateStatus: (id, data) => api.patch(`/questions/status/${id}`, data),
  markResolved: (id, data) => api.patch(`/questions/resolve/${id}`, data),
};

export default questionService;