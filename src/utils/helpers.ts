import { nanoid } from 'nanoid';

/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const uniqueId = nanoid(5).toUpperCase();
  return `ORD-${dateStr}-${uniqueId}`;
}

/**
 * Generate a tracking number
 * Format: TRK-XXXXXXXXXXXXX
 */
export function generateTrackingNumber(): string {
  return `TRK-${nanoid(12).toUpperCase()}`;
}

/**
 * Generate a transaction ID
 * Format: TXN-XXXXXXXXXXXXX
 */
export function generateTransactionId(): string {
  return `TXN-${nanoid(12).toUpperCase()}`;
}

/**
 * Generate a reference ID with custom prefix
 * Format: PREFIX-YYYYMMDD-XXXXX
 */
export function generateReferenceId(prefix: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const uniqueId = nanoid(5).toUpperCase();
  return `${prefix}-${dateStr}-${uniqueId}`;
}

/**
 * Generate a UUID for cart
 */
export function generateCartId(): string {
  return nanoid(21);
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'XAF'): string {
  if (currency === 'XAF') {
    return `${amount.toLocaleString()} FCFA`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate delivery fee based on settings
 */
export function calculateDeliveryFee(
  subtotal: number,
  defaultFee: number,
  freeThreshold: number
): number {
  if (subtotal >= freeThreshold) {
    return 0;
  }
  return defaultFee;
}

/**
 * Sanitize phone number (Cameroon format)
 */
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('237')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('00237')) {
    cleaned = cleaned.slice(5);
  }

  // Ensure it starts with valid Cameroon prefix (6 or 2)
  if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('2'))) {
    return `+237${cleaned}`;
  }

  // Return original if not valid Cameroon number
  return phone;
}

/**
 * Mask sensitive data (for logging)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return `${localPart}***@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return '****';
  return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}

/**
 * Parse pagination params from query
 */
export function parsePaginationParams(query: Record<string, unknown>): {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = ((query.sortOrder as string) || 'desc') as 'asc' | 'desc';

  return { page, limit, skip, sortBy, sortOrder };
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

/**
 * Get date range for reports
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  const endDate = new Date(now.setHours(23, 59, 59, 999));
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate = new Date(now.setHours(0, 0, 0, 0));
  }

  return { startDate, endDate };
}
