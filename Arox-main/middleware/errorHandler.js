const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  logger.error(err.message, err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please login again.'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: err.message
    });
  }

  // API error response
  if (req.path.startsWith('/api/')) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal server error.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Web error page
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render('website/error', {
    title: 'Error',
    code: statusCode,
    message: statusCode === 500 ? 'Something went wrong. Please try again later.' : err.message
  });
}

module.exports = errorHandler;
