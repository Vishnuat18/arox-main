const { body, param, query, validationResult } = require('express-validator');

/**
 * Process validation results
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
}

// Registration - Step 1: Personal Info
const personalInfoRules = [
  body('first_name').trim().notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('last_name').trim().notEmpty().withMessage('Last name is required')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[\d\s-]{10,15}$/).withMessage('Valid phone number is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Please select a gender'),
  body('dob').notEmpty().withMessage('Date of birth is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters'),
];

// Registration - Step 2: College Info
const collegeInfoRules = [
  body('college').trim().notEmpty().withMessage('College name is required'),
  body('university').trim().notEmpty().withMessage('University name is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year_of_study').trim().notEmpty().withMessage('Year of study is required'),
  body('graduation_year').trim().notEmpty().withMessage('Graduation year is required'),
];

// Login
const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Contact form
const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Message must be 20-2000 characters'),
];

module.exports = {
  validate,
  personalInfoRules,
  collegeInfoRules,
  loginRules,
  contactRules
};
