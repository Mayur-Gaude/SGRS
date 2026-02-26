export function isValidEmail(raw: string): boolean {
  const email = raw.trim();
  // Common email validation (case-insensitive), requires a TLD of at least 2 chars
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export function normalizeIndianPhone(raw: string): string {
  let cleaned = raw.replace(/\D/g, '');

  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // If already 91XXXXXXXXXX (12 digits)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If 10 digit number
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return `+${cleaned}`;
}

export function isValidIndianMobile(raw: string): boolean {
  const cleaned = raw.replace(/\D/g, '');
  const last10 = cleaned.slice(-10);
  return /^[6-9]\d{9}$/.test(last10);
}                                              
