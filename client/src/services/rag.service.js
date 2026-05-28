import api from './api';

const ragService = {
  evaluateQuestion: (data) => api.post('/rag/evaluate-question', data),
};

export default ragService;