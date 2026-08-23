const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { getDb } = require('../config/database');

/**
 * JWT Authentication Middleware
 * Checks for token in Authorization header or cookies
 */
function authenticate(req, res, next) {
  let token = null;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Check cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // For API requests, return 401
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    // For web requests, redirect to login
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    // Get fresh user data
    const db = getDb();
    const user = db.prepare('SELECT id, email, role_id, status, first_name, last_name FROM users WHERE id = ?').get(decoded.id);
    
    if (!user || user.status !== 'active') {
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({
          success: false,
          message: 'User account is inactive or not found.'
        });
      }
      return res.redirect('/login');
    }

    // Get role name
    const role = db.prepare('SELECT name FROM roles WHERE id = ?').get(user.role_id);
    
    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      role: role ? role.name : 'student',
      first_name: user.first_name || '',
      last_name: user.last_name || ''
    };
    res.locals.user = req.user;

    next();
  } catch (error) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
    return res.redirect('/login');
  }
}

/**
 * Optional authentication - doesn't block request
 * Just attaches user info if token is valid
 */
function optionalAuth(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      const db = getDb();
      const user = db.prepare('SELECT id, email, role_id, status, first_name, last_name FROM users WHERE id = ?').get(decoded.id);
      if (user && user.status === 'active') {
        const role = db.prepare('SELECT name FROM roles WHERE id = ?').get(user.role_id);
        req.user = {
          id: user.id,
          email: user.email,
          roleId: user.role_id,
          role: role ? role.name : 'student',
          first_name: user.first_name || '',
          last_name: user.last_name || ''
        };
        res.locals.user = req.user;
      }
    } catch (e) {
      // Token invalid, continue without user
    }
  }

  next();
}

module.exports = { authenticate, optionalAuth };
