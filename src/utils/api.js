// src/utils/api.js
import axios from 'axios';

// This will be set by the AuthProvider
let authContextRef = null;

export const setAuthContext = (context) => {
  authContextRef = context;
};

const api = axios.create({
  baseURL: 'http://localhost:8080', // Explicit backend URL
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 error AND has a response object
    if (error.response && error.response.status === 401) {
      // Use the auth context if available
      if (authContextRef?.handleSessionExpiry) {
        authContextRef.handleSessionExpiry();
      } else {
        // Fallback: clear storage and redirect
        localStorage.clear();
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;