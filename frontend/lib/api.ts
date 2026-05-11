import Constants from 'expo-constants';

const getBaseUrl = () => {
  const url = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
  if (!url) throw new Error('API base URL not configured. Add extra.apiUrl to app.json');
  return url.replace(/\/$/, '');
};

export async function request<T = any>(
  path: string,
  options: RequestInit & { authToken?: string } = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const { authToken, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(fetchOptions.body && !(fetchOptions.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(url, { ...fetchOptions, headers });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T = any>(path: string, opts: RequestInit & { authToken?: string } = {}) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T = any>(path: string, body?: any, opts: RequestInit & { authToken?: string } = {}) =>
    request<T>(path, { ...opts, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T = any>(path: string, body?: any, opts: RequestInit & { authToken?: string } = {}) =>
    request<T>(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(path: string, body?: any, opts: RequestInit & { authToken?: string } = {}) =>
    request<T>(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(path: string, opts: RequestInit & { authToken?: string } = {}) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};

// Department Management
export const getDepartments = (authToken?: string) => api.get('/api/departments', { authToken });
export const createDepartment = (data: any, authToken?: string) => api.post('/api/departments', data, { authToken });
export const updateDepartment = (id: string, data: any, authToken?: string) =>
  api.put(`/api/departments/${id}`, data, { authToken });
export const deactivateDepartment = (id: string, authToken?: string) =>
  api.patch(`/api/departments/${id}/deactivate`, undefined, { authToken });

// Area and Category Management
export const getAreas = (authToken?: string) => api.get('/api/areas', { authToken });
export const getCategories = (authToken?: string) => api.get('/api/categories', { authToken });
export const createArea = (data: any, authToken?: string) => api.post('/api/areas', data, { authToken });
export const createCategory = (data: any, authToken?: string) => api.post('/api/categories', data, { authToken });

// Admin Management
export const getAdmins = (authToken?: string) => api.get('/api/admin/department-admin', { authToken });
export const createAdmin = (data: any, authToken?: string) =>
  api.post('/api/admin/department-admin', data, { authToken });
export const updateAdminAreas = (id: string, data: any, authToken?: string) =>
  api.put(`/api/admin/department-admin/${id}/areas`, data, { authToken });
export const deactivateAdmin = (id: string, authToken?: string) =>
  api.patch(`/api/admin/department-admin/${id}/deactivate`, undefined, { authToken });

// Complaint Management
export interface SubmitComplaintPayload {
  department_id: string;
  area_id: string;
  category_id: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
}

export const submitComplaint = (data: SubmitComplaintPayload, authToken?: string) =>
  api.post('/api/complaints', data, { authToken });

export const getComplaints = (authToken?: string) => api.get('/api/complaints', { authToken });
export const getComplaintMeta = (authToken?: string) => api.get('/api/complaints/meta', { authToken });

export default api;
