import api from './api';

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  return api.post('/api/auth/register', payload);
}

export async function login(payload: { email: string; password: string }) {
  return api.post('/api/auth/login', payload);
}

export async function verifyOtp(payload: {
  user_id: string;
  otp_code: string;
  otp_type: string;
}) {
  return api.post('/api/auth/verify-otp', payload);
}

/* 🔥 FORGOT PASSWORD FLOW */

export async function requestPasswordReset(email: string) {
  return api.post('/api/auth/forgot-password', { email });
}

export async function verifyResetOtp(payload: {
  user_id: string;
  otp_code: string;
}) {
  return api.post('/api/auth/verify-reset-otp', payload);
}

export async function setNewPasswordApi(payload: {
  reset_token: string;
  new_password: string;
}) {
  return api.post('/api/auth/set-new-password', payload);
}