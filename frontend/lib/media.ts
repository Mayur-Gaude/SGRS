import Constants from 'expo-constants';

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const configUrl = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
  return (envUrl || configUrl || '').replace(/\/$/, '');
};

export const resolveMediaUrl = (rawUrl?: string) => {
  if (!rawUrl) return '';

  if (rawUrl.startsWith('data:') && rawUrl.length > 200000) {
    return '';
  }

  if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('file:')) {
    return rawUrl;
  }

  let normalized = rawUrl.replace(/\\/g, '/').replace(/^\/+/, '');
  const uploadsPos = normalized.toLowerCase().indexOf('uploads/');
  if (uploadsPos >= 0) {
    normalized = normalized.slice(uploadsPos);
  }

  const encoded = encodeURI(normalized);
  const base = getBaseUrl();
  return base ? `${base}/${encoded}` : encoded;
};