const logger = require('../utils/logger');

const pageController = {
  /** GET /login */
  login(req, res) {
    // If already logged in, redirect based on role
    if (req.user) {
      if (req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.role === 'staff' || req.user.role === 'trainer') {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/student/dashboard');
    }
    
    res.render('website/login', {
      layout: false,
      title: 'Login - AROX Tech'
    });
  },

  /** GET /signup /register */
  signup(req, res) {
    if (req.user) {
      if (req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.role === 'staff' || req.user.role === 'trainer') {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/student/dashboard');
    }
    
    res.render('website/signup', {
      layout: false,
      title: 'Sign Up - AROX Tech'
    });
  },

  /** Error page */
  error(req, res) {
    res.status(404).render('website/error', {
      layout: 'layouts/main',
      title: 'Page Not Found - AROX ERP',
      code: 404,
      message: 'The page you are looking for does not exist or has been moved.',
      user: req.user || { first_name: 'User', last_name: '', role: 'guest' }
    });
  }
};

module.exports = pageController;
