import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const url = err.config?.url || '';
    // Don't redirect on auth or RAG endpoints — they may 401 legitimately
    // and we don't want to break the login flow or render loop
    const isInternalEndpoint = url.startsWith('/auth') || url.startsWith('/rag');
    if (err.response?.status === 401 && !isInternalEndpoint) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err.message);
  }
);

export default api;