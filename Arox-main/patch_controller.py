import re

with open('controllers/registrationController.js', 'r', encoding='utf-8') as f:
    content = f.read()

apply_method = """
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
          INSERT INTO courses (slug, title, duration, price, category, status, is_active) 
          VALUES (?, ?, ?, 0, 'training', 'draft', 0)
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
"""

content = content.replace('  async getOfferLetter(req, res) {', apply_method + '\n  async getOfferLetter(req, res) {')

with open('controllers/registrationController.js', 'w', encoding='utf-8') as f:
    f.write(content)
