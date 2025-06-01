// src/apicalls/index.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://online-exam-portal-4.onrender.com', // Update if your backend uses a different port
});

// Attach token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle JWT expired globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message;

    if (errorMessage === 'jwt expired' || errorMessage === 'TokenExpiredError: jwt expired') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
