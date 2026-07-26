import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '@/config';
import { DownloadResponse, Stats } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error(error.message || 'An error occurred'));
    }
  }
);

// Download video service
export const downloadVideoService = {
  // Download video from URL
  download: async (url: string): Promise<DownloadResponse> => {
    const response = await api.post<{ status: string; data: DownloadResponse; cached: boolean }>(
      '/download',
      { url }
    );
    return response.data.data;
  },

  // Get statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get<{ status: string; data: Stats }>('/stats');
    return response.data.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  },
};

export default api;
