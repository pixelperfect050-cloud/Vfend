import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token attach
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('af_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error')) {
      err.response = { data: { message: 'Network error. Please check your connection and try again.' } };
    } else if (err.code === 'ERR_NETWORK' || !err.response) {
      err.response = { data: { message: 'Unable to connect to server. Please try again later.' } };
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('af_token');
      delete api.defaults.headers.common['Authorization'];
      if (!window.location.pathname.match(/\/(login|signup|)$/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;