import api from './api';

const authService = {
  signup: (data) => api.post('/auth/signup', data),
  verifyOtp: (userId, otp) => api.post('/auth/verify-otp', { userId, otp }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export default authService;