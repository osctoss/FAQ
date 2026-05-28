import api from './api';

const rtqService = {
  list: (params) => api.get('/rtq', { params }),
  get: (id) => api.get(`/rtq/${id}`),
  submitQuestion: (data) => api.post('/rtq/question', data),
  addAnswer: (id, data) => api.post(`/rtq/${id}/answer`, data),
  upvoteAnswer: (answerId) => api.post(`/rtq/answer/upvote/${answerId}`),
  approveAnswer: (answerId, data) => api.patch(`/rtq/approve-answer/${answerId}`, data),
  markAccepted: (id, data) => api.patch(`/rtq/mark-accepted/${id}`, data),
  remove: (id) => api.delete(`/rtq/${id}`),
  report: (id, data) => api.post(`/rtq/report/${id}`, data),
};

export default rtqService;