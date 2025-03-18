import axios from 'axios';

const backendUrl = process.env.BACKEND_URL;
console.log("BACKEND_URL:", process.env.BACKEND_URL);

const api = axios.create({
  baseURL: backendUrl + 'api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Sesión expirada o no autorizado');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
