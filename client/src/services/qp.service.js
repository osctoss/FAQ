import api from './api';

const qpService = {
  getMyScore: () => api.get('/qp/my-score'),
  getHistory: () => api.get('/qp/history'),
  getLeaderboard: () => api.get('/leaderboard'),
};

export default qpService;