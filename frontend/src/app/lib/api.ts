import axios from 'axios';

// Centralised API config — change this one value to switch environments
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let activeRequests = 0;
type Subscriber = (isLoading: boolean) => void;
const subscribers = new Set<Subscriber>();

export const onApiLoadingChange = (callback: Subscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const notify = () => {
  const isLoading = activeRequests > 0;
  subscribers.forEach(sub => sub(isLoading));
};

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    activeRequests++;
    notify();
    return config;
  },
  (error) => {
    activeRequests--;
    notify();
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    notify();
    return response;
  },
  (error) => {
    activeRequests--;
    notify();
    const errorMessage = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(errorMessage));
  }
);

export async function apiFetch(path: string, options: any = {}) {
  try {
    const res = await axiosInstance({
      url: path,
      method: options.method || 'GET',
      data: options.body,
      headers: options.headers,
    });
    return res.data;
  } catch (err: any) {
    throw err;
  }
}

export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, body: object) =>
    apiFetch(path, { method: 'POST', body }),
  put: (path: string, body: object) =>
    apiFetch(path, { method: 'PUT', body }),
  del: (path: string) => apiFetch(path, { method: 'DELETE' }),
};
