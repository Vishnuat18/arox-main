const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique student ID
 * Format: AROX-STU-XXXXXX
 */
function generateStudentId() {
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const year = new Date().getFullYear();
  return `AT/INT/${year}/${num}`;
}

/**
 * Generate a unique registration ID
 * Format: AROX-REG-XXXXXX
 */
function generateRegistrationId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `AROX-REG-${num}`;
}

/**
 * Generate a unique payment ID
 * Format: AROX-PAY-XXXXXX
 */
function generatePaymentId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `AROX-PAY-${num}`;
}

/**
 * Generate a unique certificate ID
 * Format: AROX-CERT-XXXXXX
 */
function generateCertificateId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `AROX-CERT-${num}`;
}

/**
 * Generate a unique invoice number
 * Format: INV-YYYYMM-XXXX
 */
function generateInvoiceNumber() {
  const date = new Date();
  const ym = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const num = Math.floor(1000 + Math.random() * 9000);
  return `INV-${ym}-${num}`;
}

/**
 * Generate a random password
 */
function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Calculate GST (18%)
 */
function calculateGST(amount) {
  const gstRate = 0.18;
  const baseAmount = amount / (1 + gstRate);
  const gstAmount = amount - baseAmount;
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: amount,
    gstRate: gstRate * 100
  };
}

/**
 * Format currency (INR)
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date, format = 'short') {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  return d.toISOString().split('T')[0];
}

/**
 * Slugify a string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate UUID
 */
function generateUUID() {
  return uuidv4();
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

module.exports = {
  generateStudentId,
  generateRegistrationId,
  generatePaymentId,
  generateCertificateId,
  generateInvoiceNumber,
  generatePassword,
  calculateGST,
  formatCurrency,
  formatDate,
  slugify,
  generateUUID,
  sanitizeFilename
};
