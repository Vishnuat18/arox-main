const { getDb } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Registration = require('../models/Registration');
const { generateStudentId, generateRegistrationId, generatePassword, calculateGST } = require('../utils/helpers');
const paymentService = require('../services/paymentService');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Safe require for Internship (may not exist in all deployments)
let Internship;
try {
  Internship = require('../models/Internship');
} catch (e) {
  Internship = null;
}

const registrationController = {
  /**
   * POST /api/registrations
   * Complete registration flow (all steps combined)
   */
  async create(req, res) {
    const db = getDb();
    
    try {
      const {
        // Step 1: Personal
        first_name, last_name, email, phone, gender, dob, address, city, state, pincode,
        // Step 2: College
        college, university, degree, department, year_of_study, graduation_year, roll_number,
        // Step 3: Course
        course_id, internship_id,
        // Step 4: Payment
        payment_plan, payment_method, coupon_code
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !course_id) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, email, phone, and course_id are required.'
        });
      }

      // Check if email already registered
      const existingStudent = Student.findByEmail(email);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'A student with this email already exists.'
        });
      }

      // Get course details
      const course = Course.findById(course_id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Calculate pricing
      const basePrice = course.discounted_price || course.price || 0;
      let discount = 0;
      let appliedCoupon = null;

      if (coupon_code) {
        const couponResult = paymentService.verifyCoupon(db, coupon_code, basePrice);
        if (couponResult.valid) {
          discount = couponResult.coupon.discount;
          appliedCoupon = couponResult.coupon;
        }
      }

      const priceAfterDiscount = basePrice - discount;
      const gstInfo = calculateGST(priceAfterDiscount);
      const totalAmount = priceAfterDiscount;
      
      // Calculate payment amounts based on plan
      let paidAmount = totalAmount;
      let balanceAmount = 0;

      if (payment_plan === 'advance') {
        paidAmount = Math.round(totalAmount * 0.5); // 50% advance
        balanceAmount = totalAmount - paidAmount;
      }

      // Generate IDs
      const studentId = generateStudentId();
      const registrationId = generateRegistrationId();
      const rawPassword = generatePassword(10);

      // Start transaction
      const transaction = db.transaction(() => {
        // 1. Create user account
        const userResult = db.prepare(`
          INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
          VALUES (?, ?, 3, 'active', ?, ?, ?, 0)
        `).run(email, require('bcryptjs').hashSync(rawPassword, 12), first_name, last_name, phone);

        const userId = userResult.lastInsertRowid;

        // 2. Create student profile
        const photoPath = req.file ? `/uploads/photos/${req.file.filename}` : null;
        
        const studentResult = db.prepare(`
          INSERT INTO students (
            user_id, student_id, photo, first_name, last_name, email, phone,
            gender, dob, address, city, state, pincode,
            college, university, degree, department, year_of_study, graduation_year, roll_number
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId, studentId, photoPath, first_name, last_name, email, phone,
          gender, dob, address, city || '', state || '', pincode || '',
          college, university, degree, department, year_of_study, graduation_year, roll_number || ''
        );

        const studentDbId = studentResult.lastInsertRowid;

        // 3. Create registration
        const regResult = db.prepare(`
          INSERT INTO registrations (
            registration_id, student_id, course_id, internship_id,
            batch_name, start_date, end_date, mode,
            status, payment_plan, total_amount, paid_amount, balance_amount,
            coupon_code, discount_amount, gst_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          registrationId, studentDbId, course_id, internship_id || null,
          course.batch_name, course.start_date, course.end_date, course.mode || 'online',
          'confirmed', payment_plan || 'full', totalAmount, paidAmount, balanceAmount,
          coupon_code || null, discount, gstInfo.gstAmount
        );

        const regDbId = regResult.lastInsertRowid;

        // 4. Increment enrollment counters
        Course.incrementEnrollment(course_id);
        if (internship_id && Internship) {
          try {
            Internship.incrementEnrollment(internship_id);
          } catch (e) {
            logger.warn('Could not increment internship enrollment:', e.message);
          }
        }

        // 5. Use coupon if applied
        if (appliedCoupon) {
          paymentService.useCoupon(db, coupon_code);
        }

        // 6. Log activity
        try {
          db.prepare(`
            INSERT INTO activity_logs (user_id, action, module, entity_type, entity_id, description)
            VALUES (?, 'registration', 'registrations', 'registration', ?, ?)
          `).run(userId, regDbId, `New registration: ${first_name} ${last_name} for ${course.title}`);
        } catch (e) {
          logger.warn('Activity log write failed:', e.message);
        }

        return {
          userId,
          studentDbId,
          regDbId,
          studentId,
          registrationId
        };
      });

      const result = transaction();

      // Generate offer letter (async, don't block response)
      pdfService.generateOfferLetter(
        { student_id: studentId, first_name, last_name },
        { registration_id: registrationId, batch_name: course.batch_name, start_date: course.start_date, end_date: course.end_date, mode: course.mode || 'online' },
        course
      ).then(pdf => {
        db.prepare('UPDATE registrations SET offer_letter_generated = 1, offer_letter_path = ? WHERE id = ?')
          .run(pdf.relativePath, result.regDbId);
      }).catch(err => logger.error('Offer letter generation failed:', err));

      // Send welcome email (async)
      emailService.sendWelcomeEmail(
        { first_name, last_name, email, student_id: studentId },
        { email, password: rawPassword }
      ).catch(err => logger.error('Welcome email failed:', err));

      res.status(201).json({
        success: true,
        message: 'Registration successful! 🎉',
        data: {
          studentId,
          registrationId,
          courseName: course.title,
          batchName: course.batch_name,
          startDate: course.start_date,
          endDate: course.end_date,
          mode: course.mode || 'online',
          trainerName: course.trainer_name,
          totalAmount: totalAmount,
          paidAmount,
          balanceAmount,
          discount,
          gst: gstInfo.gstAmount,
          paymentPlan: payment_plan || 'full',
          credentials: {
            email,
            password: rawPassword
          },
          offerLetterUrl: `/api/registrations/${registrationId}/offer-letter`
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
  },

  /**
   * GET /api/registrations/:regId/offer-letter
   */

  /**
   * POST /api/registrations/apply
   * Public application submission
   */
  async apply(req, res) {
    const db = getDb();
    
    try {
      const {
        // Step 1: Personal
        first_name, last_name, email, phone, gender,
        // Step 2: College
        college, university, degree, department, year_of_study, graduation_year,
        // Step 3: Course
        course, course_start_date, course_duration, requirements,
        // Step 4: Payment
        payment_plan
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, email, and phone are required.'
        });
      }

      // Check if email already registered
      const existingStudent = Student.findByEmail(email);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'A student with this email already exists.'
        });
      }

      // Find or create course
      let courseRecord = db.prepare('SELECT * FROM courses WHERE title = ?').get(course);
      if (!courseRecord) {
        // Auto-create as draft
        const slug = require('../utils/helpers').slugify(course || 'Generic Course');
        const result = db.prepare(`
          INSERT INTO courses (slug, title, duration, price, category, is_active) 
          VALUES (?, ?, ?, 0, 'training', 0)
        `).run(slug, course || 'Generic Course', course_duration || '6 months');
        courseRecord = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
      }

      // Generate IDs
      const studentId = generateStudentId();
      const registrationId = generateRegistrationId();
      const rawPassword = email; // As requested, use email as password

      // Start transaction
      const transaction = db.transaction(() => {
        // 1. Create user account
        const userResult = db.prepare(`
          INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
          VALUES (?, ?, 3, 'active', ?, ?, ?, 0)
        `).run(email, require('bcryptjs').hashSync(rawPassword, 12), first_name, last_name, phone);

        const userId = userResult.lastInsertRowid;

        // 2. Create student profile
        const photoPath = req.file ? `/uploads/photos/${req.file.filename}` : null;
        
        const studentResult = db.prepare(`
          INSERT INTO students (
            user_id, student_id, photo, first_name, last_name, email, phone,
            gender, college, university, degree, department, year_of_study, graduation_year
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId, studentId, photoPath, first_name, last_name, email, phone,
          gender, college, university, degree, department, year_of_study, graduation_year
        );

        const studentDbId = studentResult.lastInsertRowid;

        // 3. Create registration
        const regResult = db.prepare(`
          INSERT INTO registrations (
            registration_id, student_id, course_id,
            start_date, status, payment_plan, total_amount, paid_amount, balance_amount
          ) VALUES (?, ?, ?, ?, 'pending', ?, 0, 0, 0)
        `).run(
          registrationId, studentDbId, courseRecord.id,
          course_start_date || null, payment_plan || 'full'
        );

        const regDbId = regResult.lastInsertRowid;

        return { userId, studentDbId, regDbId, studentId, registrationId };
      });

      const result = transaction();

      // Send welcome email (async)
      emailService.sendWelcomeEmail(
        { first_name, last_name, email, student_id: studentId },
        { email, password: rawPassword }
      ).catch(err => logger.error('Welcome email failed:', err));

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully! 🎉',
        data: {
          studentId,
          registrationId,
          credentials: {
            email,
            password: rawPassword
          },
          offerLetterUrl: `/api/registrations/${registrationId}/offer-letter`,
          applicationPdfUrl: `/api/registrations/${registrationId}/application-pdf`
        }
      });
    } catch (error) {
      logger.error('Application error:', error);
      res.status(500).json({ success: false, message: 'Application failed. Please try again.' });
    }
  },

  /**
   * GET /api/registrations/:regId/application-pdf
   */
  async downloadApplicationPdf(req, res) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Application-${req.params.regId}.pdf"`);
    
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(25).text('Application Form', 100, 100);
    doc.fontSize(12).text(`Registration ID: ${req.params.regId}`, 100, 150);
    doc.end();
  },

  async getOfferLetter(req, res) {
    try {
      const registration = Registration.findByRegistrationId(req.params.regId);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      if (registration.offer_letter_path) {
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'public', registration.offer_letter_path);
        if (require('fs').existsSync(filePath)) {
          return res.download(filePath, `Offer-Letter-${registration.registration_id}.pdf`);
        }
      }

      // Generate on demand
      const student = Student.findById(registration.student_id);
      const course = Course.findById(registration.course_id);
      
      if (!student || !course) {
        return res.status(404).json({ success: false, message: 'Student or course data not found.' });
      }

      const pdf = await pdfService.generateOfferLetter(student, registration, course);

      const db = getDb();
      db.prepare('UPDATE registrations SET offer_letter_generated = 1, offer_letter_path = ? WHERE id = ?')
        .run(pdf.relativePath, registration.id);

      res.download(pdf.filePath, `Offer-Letter-${registration.registration_id}.pdf`);
    } catch (error) {
      logger.error('Offer letter error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate offer letter.' });
    }
  },

  async checkDownload(req, res) {
    try {
      const { student_id, document_type } = req.body;
      if (!student_id || !document_type) {
        return res.status(400).json({ success: false, message: 'student_id and document_type are required.' });
      }
      const db = getDb();
      const existing = db.prepare('SELECT id FROM certificate_downloads WHERE student_id = ? AND document_type = ?').get(student_id, document_type);
      return res.json({ success: true, downloaded: !!existing });
    } catch (error) {
      logger.error('Check download error:', error);
      res.status(500).json({ success: false, message: 'Failed to check download.' });
    }
  },

  async logDownload(req, res) {
    try {
      const { student_id, document_type } = req.body;
      if (!student_id || !document_type) {
        return res.status(400).json({ success: false, message: 'student_id and document_type are required.' });
      }
      const db = getDb();
      const existing = db.prepare('SELECT id FROM certificate_downloads WHERE student_id = ? AND document_type = ?').get(student_id, document_type);
      if (existing) {
        return res.json({ success: false, message: 'This document has already been downloaded for this student.' });
      }
      db.prepare('INSERT INTO certificate_downloads (student_id, document_type) VALUES (?, ?)').run(student_id, document_type);
      return res.json({ success: true, message: 'Download logged successfully.' });
    } catch (error) {
      logger.error('Log download error:', error);
      res.status(500).json({ success: false, message: 'Failed to log download.' });
    }
  }
};

module.exports = registrationController;
