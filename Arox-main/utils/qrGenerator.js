const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generate QR code as data URL (base64)
 */
async function generateQRDataURL(text, options = {}) {
  const defaults = {
    width: 200,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF'
    }
  };
  return QRCode.toDataURL(text, { ...defaults, ...options });
}

/**
 * Generate QR code and save as file
 */
async function generateQRFile(text, filename, options = {}) {
  let uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'qr');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) {
    uploadDir = path.join(require('os').tmpdir(), 'uploads', 'qr');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (err) {}
  }

  const filePath = path.join(uploadDir, filename);
  const defaults = {
    width: 300,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF'
    }
  };

  await QRCode.toFile(filePath, text, { ...defaults, ...options });
  return `/uploads/qr/${filename}`;
}

module.exports = { generateQRDataURL, generateQRFile };
