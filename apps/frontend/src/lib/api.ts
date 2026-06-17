import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const url = api.defaults.baseURL ?? '';
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(url);
  const isHttps = /^https:\/\//.test(url);
  if (!isLocal && !isHttps) {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTPS outside local development.');
  }
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
