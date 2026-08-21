const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const logger = require('../utils/logger');

const authController = {
  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // MOCK LOGINS FOR DESIGN REVIEW & TESTING
      if (email === 'admin@arox.com' && password === 'admin123') {
        const token = jwt.sign(
          { id: 1, email: 'admin@arox.com', role: 'admin' },
          authConfig.secret || 'secret',
          { expiresIn: authConfig.expiresIn || '1h' }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.json({
          success: true,
          message: 'Admin login successful!',
          redirectUrl: '/admin/dashboard',
          data: { token, user: { id: 1, email, role: 'admin', first_name: 'Admin', last_name: 'User' } }
        });
      }
      if (email === 'student@arox.com' && password === 'student123') {
        const token = jwt.sign(
          { id: 2, email: 'student@arox.com', role: 'student' },
          authConfig.secret || 'secret',
          { expiresIn: authConfig.expiresIn || '1h' }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.json({
          success: true,
          message: 'Student login successful!',
          redirectUrl: '/student/dashboard',
          data: { token, user: { id: 2, email, role: 'student', first_name: 'Student', last_name: 'User' } }
        });
      }
      if (email === 'employee@arox.com' && password === 'employee123') {
        const token = jwt.sign(
          { id: 3, email: 'employee@arox.com', role: 'trainer' },
          authConfig.secret || 'secret',
          { expiresIn: authConfig.expiresIn || '1h' }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        return res.json({
          success: true,
          message: 'Employee login successful!',
          redirectUrl: '/admin/dashboard',
          data: { token, user: { id: 3, email, role: 'trainer', first_name: 'Staff', last_name: 'Trainer' } }
        });
      }

      const user = User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isValid = await User.verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive. Please contact support.'
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role_name },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      User.updateLastLogin(user.id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Get student info if student role
      let student = null;
      if (user.role_name === 'student') {
        student = Student.findByUserId(user.id);
      }

      const redirectUrl = ['admin', 'super_admin', 'trainer', 'staff'].includes(user.role_name)
        ? '/admin/dashboard' 
        : '/student/dashboard';

      res.json({
        success: true,
        message: 'Login successful!',
        redirectUrl,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role_name,
            student
          }
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/register
   * (Used internally during registration wizard)
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const existing = User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const user = await User.create({ email, password, roleId: 3 });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: 'student' },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        data: { token, user: { id: user.id, email: user.email, role: 'student' } }
      });
    } catch (error) {
      logger.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = User.findByEmail(email);

      // Always return success (don't reveal if email exists)
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists with that email, you will receive a password reset link.'
        });
      }

      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      User.setResetToken(user.id, resetToken, expires);

      logger.info(`🔑 Password reset token for ${email}: ${resetToken}`);

      res.json({
        success: true,
        message: 'If an account exists with that email, you will receive a password reset link.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  /**
   * POST /api/auth/logout
   */
  logout(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully.' });
  },

  /**
   * GET /api/auth/me
   */
  async me(req, res) {
    try {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      let student = null;
      if (user.role_name === 'student') {
        student = Student.findByUserId(user.id);
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role_name,
          student
        }
      });
    } catch (error) {
      logger.error('Me error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = authController;
