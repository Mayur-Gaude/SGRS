import Constants from 'expo-constants';

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const configUrl = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
  const url = envUrl || configUrl;
  if (!url) {
    throw new Error(
      'API base URL not configured. Set EXPO_PUBLIC_API_URL or extra.apiUrl in app.json'
    );
  }
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

// Auth/Profile
export const getMyProfile = (authToken?: string) => api.get('/api/auth/me', { authToken });
export const updateMyProfile = (data: any, authToken?: string) => api.put('/api/auth/me', data, { authToken });
export const uploadMyAvatar = (
  fileUri: string,
  authToken?: string,
  fileName = 'profile-photo.jpg',
  fileType = 'image/jpeg'
) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: fileType,
  } as any);

  return api.post('/api/auth/me/avatar', formData, { authToken });
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
export const updateArea = (id: string, data: any, authToken?: string) =>
  api.put(`/api/areas/${id}`, data, { authToken });
export const deactivateArea = (id: string, authToken?: string) =>
  api.patch(`/api/areas/${id}/deactivate`, undefined, { authToken });
export const createCategory = (data: any, authToken?: string) => api.post('/api/categories', data, { authToken });
export const updateCategory = (id: string, data: any, authToken?: string) =>
  api.put(`/api/categories/${id}`, data, { authToken });
export const deactivateCategory = (id: string, authToken?: string) =>
  api.patch(`/api/categories/${id}/deactivate`, undefined, { authToken });

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
export const getAssignedComplaints = (authToken?: string) =>
  api.get('/api/complaints/assigned', { authToken });
export const getComplaintById = (complaintId: string, authToken?: string) =>
  api.get(`/api/complaints/${complaintId}`, { authToken });
export const getComplaintMeta = (authToken?: string) => api.get('/api/complaints/meta', { authToken });
export const updateComplaintStatus = (complaintId: string, status: string, authToken?: string) =>
  api.patch(`/api/complaints/${complaintId}/status`, { status }, { authToken });
export const addComplaintRemark = (complaintId: string, remark: string, authToken?: string) =>
  api.post(`/api/complaints/${complaintId}/remarks`, { remark }, { authToken });
export const resolveComplaint = (complaintId: string, resolutionRemark: string, authToken?: string) =>
  api.patch(`/api/complaints/${complaintId}/resolve`, { resolutionRemark }, { authToken });
export const getComplaintMedia = (complaintId: string, authToken?: string) =>
  api.get(`/api/complaints/${complaintId}/media`, { authToken });

// Notifications
export const getMyNotifications = (authToken?: string) =>
  api.get('/api/notifications', { authToken });
export const markNotificationRead = (notificationId: string, authToken?: string) =>
  api.patch(`/api/notifications/${notificationId}/read`, undefined, { authToken });
export const markAllNotificationsRead = (authToken?: string) =>
  api.patch('/api/notifications/read-all', undefined, { authToken });
export const deleteNotification = (notificationId: string, authToken?: string) =>
  api.delete(`/api/notifications/${notificationId}`, { authToken });

// Reopen
export const requestReopen = (complaintId: string, reason: string, authToken?: string) =>
  api.post(`/api/reopen/${complaintId}`, { reason }, { authToken });
export const reviewReopenRequest = (
  reopenId: string,
  decision: 'APPROVED' | 'REJECTED',
  authToken?: string
) => api.patch(`/api/reopen/review/${reopenId}`, { decision }, { authToken });

// Feedback
export const submitFeedback = (complaintId: string, rating: number, comment?: string, authToken?: string) =>
  api.post(`/api/feedback/${complaintId}`, { rating, comment }, { authToken });

// Ban & Appeal
export const getMyBan = (authToken?: string) =>
  api.get('/api/bans/my-ban', { authToken });
export const createBanAppeal = (banId: string, reason: string, authToken?: string) =>
  api.post(`/api/appeals/${banId}`, { reason }, { authToken });
export const getMyAppeal = (authToken?: string) =>
  api.get('/api/appeals', { authToken });

// Violations
export const createViolation = (data: any, authToken?: string) =>
  api.post('/api/violations', data, { authToken });

// Analytics
export const getDepartmentDashboardAnalytics = (departmentId: string, authToken?: string) =>
  api.get(`/api/analytics/department/${departmentId}`, { authToken });
export const getSystemOverviewAnalytics = (authToken?: string) =>
  api.get('/api/analytics/overview', { authToken });
export const getAreaInsightsAnalytics = (authToken?: string) =>
  api.get('/api/analytics/areas', { authToken });
export const getCategoryInsightsAnalytics = (authToken?: string) =>
  api.get('/api/analytics/categories', { authToken });
export const generateAnalyticsReport = (data: any, authToken?: string) =>
  api.post('/api/analytics/generate', data, { authToken });
export const getDepartmentReportsAnalytics = (departmentId: string, authToken?: string) =>
  api.get(`/api/analytics/reports/${departmentId}`, { authToken });
export const getAdminPerformanceAnalytics = (adminId: string, authToken?: string) =>
  api.get(`/api/analytics/admin/${adminId}`, { authToken });

export const uploadComplaintMedia = (
  complaintId: string,
  fileUri: string,
  authToken?: string,
  fileName = 'complaint-photo.jpg',
  fileType = 'image/jpeg'
) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: fileType,
  } as any);

  return api.post(`/api/complaints/${complaintId}/media`, formData, { authToken });
};

export default api;
