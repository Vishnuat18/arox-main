const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { sanitizeFilename } = require('../utils/helpers');
const appConfig = require('../config/app');

// Determine upload root: on Vercel/serverless use /tmp/uploads, locally use public/uploads
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const baseUploadDir = isServerless 
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '..', 'public', 'uploads');

// Ensure upload directories exist safely
const dirs = ['photos', 'documents', 'submissions', 'certificates', 'qr', 'receipts'];
dirs.forEach(dir => {
  try {
    const dirPath = path.join(baseUploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    try {
      const fallback = path.join(os.tmpdir(), 'uploads', dir);
      if (!fs.existsSync(fallback)) {
        fs.mkdirSync(fallback, { recursive: true });
      }
    } catch (e) {}
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    if (file.fieldname === 'photo') folder = 'photos';
    else if (file.fieldname === 'submission') folder = 'submissions';
    else if (file.fieldname === 'certificate') folder = 'certificates';
    else if (file.fieldname === 'receipt' || file.fieldname === 'payment_proof' || file.fieldname === 'screenshot') folder = 'receipts';

    let uploadPath = path.join(baseUploadDir, folder);
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    } catch (e) {
      uploadPath = path.join(os.tmpdir(), 'uploads', folder);
      try {
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
      } catch (err) {}
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = sanitizeFilename(path.basename(file.originalname, ext));
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    photo: /jpeg|jpg|png|gif|webp/,
    document: /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx/,
    submission: /zip|rar|pdf|doc|docx|ppt|pptx|py|js|html|css/,
    receipt: /jpeg|jpg|png|webp|pdf/
  };

  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const fieldType = file.fieldname === 'photo' ? 'photo' : 
                    file.fieldname === 'submission' ? 'submission' : 
                    (file.fieldname === 'receipt' || file.fieldname === 'payment_proof' || file.fieldname === 'screenshot') ? 'receipt' : 'document';

  if (allowedTypes[fieldType].test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not allowed for ${fieldType} uploads.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: appConfig.upload.maxFileSize
  }
});

module.exports = upload;
