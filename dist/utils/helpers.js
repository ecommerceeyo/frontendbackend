"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.generateTrackingNumber = generateTrackingNumber;
exports.generateTransactionId = generateTransactionId;
exports.generateReferenceId = generateReferenceId;
exports.generateCartId = generateCartId;
exports.slugify = slugify;
exports.formatCurrency = formatCurrency;
exports.calculateDeliveryFee = calculateDeliveryFee;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.parsePaginationParams = parsePaginationParams;
exports.isEmpty = isEmpty;
exports.deepClone = deepClone;
exports.calculatePercentage = calculatePercentage;
exports.getDateRange = getDateRange;
const nanoid_1 = require("nanoid");
/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const uniqueId = (0, nanoid_1.nanoid)(5).toUpperCase();
    return `ORD-${dateStr}-${uniqueId}`;
}
/**
 * Generate a tracking number
 * Format: TRK-XXXXXXXXXXXXX
 */
function generateTrackingNumber() {
    return `TRK-${(0, nanoid_1.nanoid)(12).toUpperCase()}`;
}
/**
 * Generate a transaction ID
 * Format: TXN-XXXXXXXXXXXXX
 */
function generateTransactionId() {
    return `TXN-${(0, nanoid_1.nanoid)(12).toUpperCase()}`;
}
/**
 * Generate a reference ID with custom prefix
 * Format: PREFIX-YYYYMMDD-XXXXX
 */
function generateReferenceId(prefix) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const uniqueId = (0, nanoid_1.nanoid)(5).toUpperCase();
    return `${prefix}-${dateStr}-${uniqueId}`;
}
/**
 * Generate a UUID for cart
 */
function generateCartId() {
    return (0, nanoid_1.nanoid)(21);
}
/**
 * Slugify a string
 */
function slugify(text) {
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
function formatCurrency(amount, currency = 'XAF') {
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
function calculateDeliveryFee(subtotal, defaultFee, freeThreshold) {
    if (subtotal >= freeThreshold) {
        return 0;
    }
    return defaultFee;
}
/**
 * Sanitize phone number (Cameroon format)
 */
function sanitizePhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    // Handle different formats
    if (cleaned.startsWith('237')) {
        cleaned = cleaned.slice(3);
    }
    else if (cleaned.startsWith('00237')) {
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
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2)
        return `${localPart}***@${domain}`;
    return `${localPart.slice(0, 2)}***@${domain}`;
}
function maskPhone(phone) {
    if (phone.length <= 4)
        return '****';
    return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}
/**
 * Parse pagination params from query
 */
function parsePaginationParams(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = (query.sortOrder || 'desc');
    return { page, limit, skip, sortBy, sortOrder };
}
/**
 * Check if value is empty
 */
function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Deep clone an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Calculate percentage
 */
function calculatePercentage(value, total) {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100 * 100) / 100;
}
/**
 * Get date range for reports
 */
function getDateRange(period) {
    const now = new Date();
    const endDate = new Date(now.setHours(23, 59, 59, 999));
    let startDate;
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
//# sourceMappingURL=helpers.js.map