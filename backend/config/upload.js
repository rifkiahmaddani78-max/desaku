const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/dokumen',
  'uploads/bansos',
  'uploads/ktp',
  'uploads/kk',
  'uploads/profile',
];

uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created upload directory: ${dir}`);
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads';

    // Determine folder based on file type or route
    if (req.originalUrl.includes('/pengajuan-bansos')) {
      if (file.fieldname === 'dokumen_ktp') {
        folder = 'uploads/ktp';
      } else if (file.fieldname === 'dokumen_kk') {
        folder = 'uploads/kk';
      } else if (file.fieldname === 'dokumen_surat_permohonan') {
        folder = 'uploads/dokumen';
      } else {
        folder = 'uploads/bansos';
      }
    } else if (
      req.originalUrl.includes('/users') ||
      req.originalUrl.includes('/profile')
    ) {
      folder = 'uploads/profile';
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;

    // Store filename in request for later use
    if (!req.uploadedFiles) req.uploadedFiles = {};
    req.uploadedFiles[file.fieldname] = filename;

    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed: ${file.mimetype}. Only images and PDF/DOC files are allowed.`
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Max 5 files per request
  },
});

// Helper functions
const uploadUtils = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),

  // Multiple files upload
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),

  // Fields upload
  fields: (fields) => upload.fields(fields),

  // Remove file
  removeFile: (filePath) => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`Removed file: ${filePath}`);
    }
  },

  // Get file URL
  getFileUrl: (filename, folder = '') => {
    if (!filename) return null;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${folder ? folder + '/' : ''}${filename}`;
  },

  // Validate file type
  validateFileType: (
    filename,
    allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
  ) => {
    if (!filename) return false;
    const ext = path.extname(filename).toLowerCase().substring(1);
    return allowedTypes.includes(ext);
  },
};

module.exports = uploadUtils;
