import api from './api';

const faqService = {
  list: (params) => api.get('/faq', { params }),
  get: (id) => api.get(`/faq/${id}`),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  remove: (id) => api.delete(`/faq/${id}`),
  upvote: (id) => api.post(`/faq/upvote/${id}`),
  getCategories: () => api.get('/faq/categories'),
};

export default faqService;