export const BASE_URL = 'http://localhost:5000/api';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, body: object) =>
    apiFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  postForm: (path: string, formData: FormData) =>
    apiFetch(path, { method: 'POST', body: formData }),
  put: (path: string, body: object) =>
    apiFetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  putForm: (path: string, formData: FormData) =>
    apiFetch(path, { method: 'PUT', body: formData }),
  del: (path: string) => apiFetch(path, { method: 'DELETE' }),
};
