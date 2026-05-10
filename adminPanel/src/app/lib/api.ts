import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout for admin
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // window.location.href = '/login'; // Optional: Redirect to login
    }
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
  postForm: (path: string, formData: FormData) =>
    apiFetch(path, { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }),
  put: (path: string, body: object) =>
    apiFetch(path, { method: 'PUT', body }),
  putForm: (path: string, formData: FormData) =>
    apiFetch(path, { method: 'PUT', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }),
  del: (path: string) => apiFetch(path, { method: 'DELETE' }),
};
