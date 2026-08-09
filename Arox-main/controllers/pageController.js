const logger = require('../utils/logger');

const pageController = {
  /** GET /login */
  login(req, res) {
    // If already logged in, redirect based on role
    if (req.user) {
      if (req.user.role === 'admin' || req.user.role === 'staff') {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/student/dashboard');
    }
    
    res.render('website/login', {
      layout: false,
      title: 'Login - AROX Tech'
    });
  },

  /** Error page */
  error(req, res) {
    res.status(404).render('website/error', {
      title: 'Page Not Found',
      code: 404,
      message: 'The page you are looking for does not exist.'
    });
  }
};

module.exports = pageController;
