import axios, { AxiosError } from 'axios';

const DEFAULT_BASE_URL =
  'https://node.aitechnotech.in/carlinee/api/v1';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const cleanBaseUrl = (config.baseURL || '').replace(/\/+$/, '');

    if (
      cleanBaseUrl.endsWith('/api/v1') &&
      config.url?.startsWith('/api/v1')
    ) {
      config.url = config.url.replace(/^\/api\/v1/, '');
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr =
      error as AxiosError<{
        message?: string;
        error?: string;
        statusCode?: number;
      }>;

    const status = axiosErr.response?.status;
    const responseData = axiosErr.response?.data;
    const backendMessage =
      responseData?.message || responseData?.error;

    if (status === 401) {
      return (
        backendMessage ||
        'Authentication required. Please log in again.'
      );
    }

    if (status === 403) {
      return (
        backendMessage ||
        "You don't have permission to access this resource."
      );
    }

    if (backendMessage) {
      return backendMessage;
    }

    switch (status) {
      case 400:
        return 'Bad request. Please check the submitted data.';

      case 404:
        return 'The requested resource was not found.';

      case 409:
        return 'A conflict occurred. Please check the submitted data.';

      case 500:
        return 'Internal server error. Please try again later.';

      default:
        if (axiosErr.code === 'ERR_NETWORK') {
          return 'Network error. Please check your internet connection.';
        }

        return axiosErr.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};