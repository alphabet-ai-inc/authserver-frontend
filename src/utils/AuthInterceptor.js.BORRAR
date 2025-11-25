// src/utils/authInterceptor.js
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Attempt to refresh token
        axios.post('/auth/refresh', {}, { withCredentials: true })
          .then(({ data }) => {
            // If refresh successful, update token and retry original request
            const token = data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;

            processQueue(null, token);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Redirect to login if refresh fails
            redirectToLogin();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/login?session=expired';
};

export default axios;