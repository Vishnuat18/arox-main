/**
 * Role-based access guard middleware
 * Usage: roleGuard('admin', 'super_admin')
 */
function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }
      return res.redirect('/login');
    }

    if (!allowedRoles.includes(req.user.role)) {
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource.'
        });
      }
      return res.status(403).render('website/error', {
        layout: 'layouts/main',
        title: 'Access Denied - AROX ERP',
        code: 403,
        message: 'You do not have permission to access this page. Please log in with the appropriate credentials.',
        user: req.user || { first_name: 'User', last_name: '', role: 'guest' }
      });
    }

    next();
  };
}

module.exports = roleGuard;
