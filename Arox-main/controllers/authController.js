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
      const email = (req.body.email || '').trim().toLowerCase();
      const password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      // Database-backed authentication
      let user = User.findByEmail(email);

      // Handle standard demo accounts auto-provisioning / fallback
      const demoAccounts = {
        'admin@arox.com': { pass: ['admin123', 'Admin@123', 'admin'], roleId: 1, roleName: 'super_admin', first: 'AROX', last: 'Admin' },
        'admin@aroxtech.com': { pass: ['Admin@123', 'admin123', 'admin'], roleId: 1, roleName: 'super_admin', first: 'Arox', last: 'Admin' },
        'student@arox.com': { pass: ['student123', 'Student@123', 'student'], roleId: 3, roleName: 'student', first: 'Aarav', last: 'Sharma' },
        'employee@arox.com': { pass: ['employee123', 'Employee@123', 'employee'], roleId: 4, roleName: 'trainer', first: 'Rajesh', last: 'Kumar' }
      };

      const demoConfig = demoAccounts[email];
      let isDemoMatch = false;

      if (demoConfig && demoConfig.pass.includes(password)) {
        isDemoMatch = true;
        if (!user) {
          try {
            user = await User.create({
              email,
              password,
              roleId: demoConfig.roleId,
              first_name: demoConfig.first,
              last_name: demoConfig.last,
              status: 'active'
            });
            user.role_name = demoConfig.roleName;

            if (demoConfig.roleId === 3) {
              const { generateStudentId } = require('../utils/helpers');
              try {
                Student.create({
                  user_id: user.id,
                  student_id: generateStudentId(),
                  first_name: demoConfig.first,
                  last_name: demoConfig.last,
                  email,
                  phone: '9876543210',
                  status: 'active'
                });
              } catch (e) {}
            }
          } catch (e) {
            logger.warn('Demo user provision note:', e.message);
          }
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      let isValid = isDemoMatch;
      if (!isValid && user.password_hash) {
        isValid = await User.verifyPassword(password, user.password_hash);
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user.status && user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive. Please contact support.'
        });
      }

      // Generate JWT
      const roleName = user.role_name || (user.role_id === 1 ? 'super_admin' : (user.role_id === 2 ? 'admin' : (user.role_id === 4 ? 'trainer' : 'student')));
      const token = jwt.sign(
        { id: user.id, email: user.email, role: roleName },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      try {
        User.updateLastLogin(user.id);
      } catch (e) {}

      // Set cookie with explicit root path and lax sameSite
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Get student info if student role
      let student = null;
      if (roleName === 'student') {
        try {
          student = Student.findByUserId(user.id);
        } catch (e) {}
      }

      const redirectUrl = ['admin', 'super_admin', 'trainer', 'staff'].includes(roleName)
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
            role: roleName,
            first_name: user.first_name,
            last_name: user.last_name,
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
   * (Creates account and authenticates user)
   */
  async register(req, res) {
    try {
      const email = (req.body.email || '').trim().toLowerCase();
      const password = req.body.password;
      const rawName = (req.body.name || '').trim();
      const phone = (req.body.phone || '').trim();
      const roleStr = (req.body.role || 'student').toLowerCase();

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      const existing = User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      const nameParts = rawName.split(' ');
      const first_name = nameParts[0] || 'User';
      const last_name = nameParts.slice(1).join(' ') || '';

      const roleId = ['employee', 'trainer', 'staff'].includes(roleStr) ? 4 : (roleStr === 'admin' ? 2 : 3);
      const roleName = roleId === 4 ? 'trainer' : (roleId === 2 ? 'admin' : 'student');

      const user = await User.create({
        email,
        password,
        roleId,
        first_name,
        last_name,
        phone,
        status: 'active'
      });

      // Create student profile record if registering as student
      let student = null;
      if (roleId === 3) {
        const { generateStudentId } = require('../utils/helpers');
        const student_id = generateStudentId();
        try {
          student = Student.create({
            user_id: user.id,
            student_id,
            photo: null,
            first_name,
            last_name,
            email,
            phone: phone || 'N/A',
            gender: 'other',
            dob: null,
            address: '',
            city: '',
            state: '',
            pincode: '',
            college: '',
            university: '',
            degree: '',
            department: '',
            year_of_study: '',
            graduation_year: '',
            roll_number: ''
          });
        } catch (sErr) {
          logger.warn('Student profile auto-creation warning:', sErr.message);
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: roleName },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const redirectUrl = roleId === 3 ? '/student/dashboard' : '/admin/dashboard';

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        redirectUrl,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: roleName,
            first_name,
            last_name,
            student
          }
        }
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

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required.'
        });
      }

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
    res.clearCookie('token', { path: '/' });
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
