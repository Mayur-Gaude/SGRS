import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Prefer app.json extra.apiUrl
  const url = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
  if (!url) throw new Error('API base URL not configured. Add extra.apiUrl to app.json');
  return url.replace(/\/$/, '');
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function request<T = any>(path: string, options: RequestInit & { authToken?: string } = {}): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.authToken) headers['Authorization'] = `Bearer ${options.authToken}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string, opts: RequestInit = {}) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T = any>(path: string, body?: any, opts: RequestInit = {}) => request<T>(path, { ...opts, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T = any>(path: string, body?: any, opts: RequestInit = {}) => request<T>(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(path: string, body?: any, opts: RequestInit = {}) => request<T>(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(path: string, opts: RequestInit = {}) => request<T>(path, { ...opts, method: 'DELETE' }),
};

export default api;
