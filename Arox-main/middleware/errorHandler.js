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

  // Web error page - determine correct layout based on path
  const statusCode = err.statusCode || 500;
  let layout = 'layouts/main';
  
  if (req.path && req.path.startsWith('/admin')) {
    layout = 'layouts/admin';
  } else if (req.path && req.path.startsWith('/student')) {
    layout = 'layouts/student';
  }

  // Determine the correct error message
  let errorMessage;
  if (statusCode === 501) {
    errorMessage = 'This feature is coming soon.';
  } else if (statusCode === 404) {
    errorMessage = "The page you're looking for doesn't exist or has been moved.";
  } else {
    errorMessage = 'Something went wrong. Please try again later.';
  }

  var user = req.user || { first_name: 'User', last_name: '', role: 'guest' };

  try {
    res.status(statusCode).render('website/error', {
      layout: layout,
      title: 'Error - AROX ERP',
      code: statusCode,
      message: err.message || errorMessage,
      pageTitle: 'Error',
      user: user
    });
  } catch (renderErr) {
    // Fallback: if EJS rendering itself fails, send plain HTML
    logger.error('Error rendering error page:', renderErr);
    res.status(statusCode).send(
      '<!DOCTYPE html><html><head><title>Error ' + statusCode + '</title></head><body style="font-family:sans-serif;text-align:center;padding:60px 20px;">' +
      '<h1 style="font-size:4rem;color:#155EEF;">' + statusCode + '</h1>' +
      '<h2>' + (statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong') + '</h2>' +
      '<p>' + (err.message || errorMessage) + '</p>' +
      '<a href="/" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#155EEF;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Back to Home</a>' +
      '</body></html>'
    );
  }
}

module.exports = errorHandler;
