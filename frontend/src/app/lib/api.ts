// Centralised API config — change this one value to switch environments
export const API_BASE = 'http://localhost:5000/api';

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

export async function apiFetch(path: string, options?: RequestInit) {
  activeRequests++;
  notify();
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }
    return await res.json();
  } finally {
    activeRequests--;
    notify();
  }
}

export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, body: object) =>
    apiFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
};
