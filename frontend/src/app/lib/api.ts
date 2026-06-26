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
// Timeout is 60s — Render free tier cold starts can take up to 50s
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
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

// Retry helper — retries failed GET requests with exponential backoff.
// Handles Render.com cold starts where the first 1-2 requests may timeout
// before the server finishes waking up.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(config: any, retries = 3, baseDelay = 3000): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axiosInstance(config);
      return res.data;
    } catch (err: any) {
      const isLastAttempt = attempt === retries;
      // Only retry on network errors or timeouts (not 4xx/5xx responses)
      const isRetryable = !err.response || err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK';
      if (isLastAttempt || !isRetryable) throw err;
      // Exponential backoff: 3s, 6s, 12s
      await delay(baseDelay * Math.pow(2, attempt));
    }
  }
}

export async function apiFetch(path: string, options: any = {}) {
  const config = {
    url: path,
    method: options.method || 'GET',
    data: options.body,
    headers: options.headers,
  };

  // Only GET requests are retried (safe to repeat); mutations are not
  if (config.method === 'GET') {
    return fetchWithRetry(config);
  }

  try {
    const res = await axiosInstance(config);
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

// Silent wakeup ping — fires immediately when this module is imported.
// This starts the Render cold-start process as early as possible, before
// individual pages even mount and start fetching their own data.
if (typeof window !== 'undefined') {
  fetch(`${API_BASE}/profile`, { signal: AbortSignal.timeout(65000) }).catch(() => {});
}
