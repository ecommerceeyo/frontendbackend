/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
export declare function generateOrderNumber(): string;
/**
 * Generate a tracking number
 * Format: TRK-XXXXXXXXXXXXX
 */
export declare function generateTrackingNumber(): string;
/**
 * Generate a transaction ID
 * Format: TXN-XXXXXXXXXXXXX
 */
export declare function generateTransactionId(): string;
/**
 * Generate a reference ID with custom prefix
 * Format: PREFIX-YYYYMMDD-XXXXX
 */
export declare function generateReferenceId(prefix: string): string;
/**
 * Generate a UUID for cart
 */
export declare function generateCartId(): string;
/**
 * Slugify a string
 */
export declare function slugify(text: string): string;
/**
 * Format currency
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * Calculate delivery fee based on settings
 */
export declare function calculateDeliveryFee(subtotal: number, defaultFee: number, freeThreshold: number): number;
/**
 * Sanitize phone number (Cameroon format)
 */
export declare function sanitizePhoneNumber(phone: string): string;
/**
 * Mask sensitive data (for logging)
 */
export declare function maskEmail(email: string): string;
export declare function maskPhone(phone: string): string;
/**
 * Parse pagination params from query
 */
export declare function parsePaginationParams(query: Record<string, unknown>): {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};
/**
 * Check if value is empty
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Calculate percentage
 */
export declare function calculatePercentage(value: number, total: number): number;
/**
 * Get date range for reports
 */
export declare function getDateRange(period: 'today' | 'week' | 'month' | 'year'): {
    startDate: Date;
    endDate: Date;
};
//# sourceMappingURL=helpers.d.ts.map