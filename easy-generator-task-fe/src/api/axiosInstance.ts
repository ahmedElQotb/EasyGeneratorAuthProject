import axios from 'axios';

// Get API URL from environment variables, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401, reject immediately
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Check if this is an auth endpoint - don't try to refresh
    if (originalRequest.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          // Retry the original request after token is refreshed
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Start refreshing
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint using base axios to avoid interceptor loop
      await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
      
      // Refresh succeeded, resolve all queued requests (they will retry themselves)
      processQueue(null);
      
      // Retry original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed, reject all queued requests
      processQueue(refreshError);
      
      // Clear auth state and redirect
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/signin';
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
