const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sanitizeFilename } = require('../utils/helpers');
const appConfig = require('../config/app');

// Ensure upload directories exist
const dirs = ['photos', 'documents', 'submissions', 'certificates', 'qr'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', 'public', 'uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    if (file.fieldname === 'photo') folder = 'photos';
    else if (file.fieldname === 'submission') folder = 'submissions';
    else if (file.fieldname === 'certificate') folder = 'certificates';

    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', folder);
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
    submission: /zip|rar|pdf|doc|docx|ppt|pptx|py|js|html|css/
  };

  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const fieldType = file.fieldname === 'photo' ? 'photo' : 
                    file.fieldname === 'submission' ? 'submission' : 'document';

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
