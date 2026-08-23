const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    
    if (!student) {
      return res.render('student/courses/index', {
        layout: 'layouts/student',
        title: 'My Courses | AROX ERP',
        pageTitle: 'My Courses',
        user: req.user,
        student: null,
        courses: []
      });
    }

    const courses = db.prepare(`
      SELECT r.id as registration_id, r.status as reg_status, r.created_at as enrolled_at,
             c.* 
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `).all(student.id);

    res.render('student/courses/index', {
      layout: 'layouts/student',
      title: 'My Courses | AROX ERP',
      pageTitle: 'My Courses',
      user: req.user,
      student,
      courses
    });
  } catch (error) {
    logger.error('Student Courses List Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Something went wrong loading courses. Please try again later.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};

exports.show = (req, res) => {
  try {
    const db = getDb();
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.id);
    
    if (!student) {
      return res.redirect('/student/dashboard');
    }

    const regId = req.params.id; // registration_id

    // Verify student owns this registration
    const registration = db.prepare(`
      SELECT r.*, c.title as course_title, c.slug as course_slug, c.duration as course_duration, 
             c.curriculum, c.projects as course_projects_json, c.trainer_name, c.trainer_title,
             c.start_date, c.end_date, c.mode, c.description
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.id = ? AND r.student_id = ?
    `).get(regId, student.id);

    if (!registration) {
      return res.status(404).render('website/error', {
        layout: 'layouts/student',
        title: 'Not Found - Student Portal',
        code: 404,
        message: 'Registration not found or access denied.',
        user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
      });
    }

    // Parse curriculum
    let curriculum = [];
    try {
      curriculum = JSON.parse(registration.curriculum || '[]');
    } catch (e) {
      logger.error('Failed to parse curriculum JSON:', e);
    }

    // 1. Fetch Daily Attendance for this course
    let attendance = [];
    try {
      attendance = db.prepare(`
        SELECT date, status, check_in_time, check_out_time, remarks
        FROM attendance
        WHERE student_id = ? AND course_id = ?
        ORDER BY date DESC
      `).all(student.id, registration.course_id);
    } catch (e) {
      logger.warn('Attendance query failed:', e.message);
    }

    // Fetch today's attendance record (local YYYY-MM-DD)
    let todayAttendance = null;
    const localToday = new Date();
    const year = localToday.getFullYear();
    const month = String(localToday.getMonth() + 1).padStart(2, '0');
    const day = String(localToday.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    try {
      todayAttendance = db.prepare(`
        SELECT * FROM attendance
        WHERE student_id = ? AND course_id = ? AND date = ?
      `).get(student.id, registration.course_id, todayStr);
    } catch (e) {
      logger.warn('Today attendance query failed:', e.message);
    }

    // Calculate attendance rate for this course
    let attendancePercent = 100;
    try {
      const attSummary = db.prepare(`
        SELECT COUNT(*) as total, SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
        FROM attendance
        WHERE student_id = ? AND course_id = ?
      `).get(student.id, registration.course_id);
      
      const total = attSummary ? parseInt(attSummary.total, 10) || 0 : 0;
      const present = attSummary ? parseInt(attSummary.present, 10) || 0 : 0;
      
      attendancePercent = total > 0 ? Math.round((present / total) * 100) : 100;
    } catch (e) {
      logger.warn('Attendance summary query failed:', e.message);
    }

    // 2. Fetch Assignments & Submissions
    let assignments = [];
    try {
      assignments = db.prepare(`
        SELECT a.*, s.submission_path, s.submission_text, s.marks, s.feedback, s.status as submission_status, s.submitted_at
        FROM assignments a
        LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
        WHERE a.course_id = ? AND a.is_active = 1
        ORDER BY a.due_date ASC
      `).all(student.id, registration.course_id);
    } catch (e) {
      logger.warn('Assignments query failed:', e.message);
    }

    // 3. Fetch Projects & Submissions
    let projects = [];
    try {
      projects = db.prepare(`
        SELECT p.*, s.title as submission_title, s.description as submission_desc, s.file_path, s.github_link, s.demo_link,
               s.marks, s.feedback, s.status as submission_status, s.submitted_at
        FROM projects p
        LEFT JOIN project_submissions s ON p.id = s.project_id AND s.student_id = ?
        WHERE p.course_id = ? AND p.is_active = 1
        ORDER BY p.due_date ASC
      `).all(student.id, registration.course_id);
    } catch (e) {
      logger.warn('Projects query failed:', e.message);
    }

    // 4. Fetch Certificates if any
    let certificates = [];
    try {
      certificates = db.prepare(`
        SELECT * FROM certificates 
        WHERE student_id = ? AND course_id = ? AND registration_id = ?
      `).all(student.id, registration.course_id, registration.id);
    } catch (e) {
      logger.warn('Certificates query failed:', e.message);
    }

    // 5. Fetch Payments & Verification Proofs for this registration
    let payments = [];
    try {
      payments = db.prepare(`
        SELECT * FROM payments 
        WHERE registration_id = ?
        ORDER BY created_at DESC
      `).all(registration.id);
    } catch (e) {
      logger.warn('Payments query failed:', e.message);
    }

    res.render('student/courses/show', {
      layout: 'layouts/student',
      title: `${registration.course_title} | AROX ERP`,
      pageTitle: 'Course Details',
      user: req.user,
      student,
      registration,
      curriculum,
      attendance,
      todayAttendance,
      attendancePercent,
      assignments,
      projects,
      certificates,
      payments
    });
  } catch (error) {
    logger.error('Student Course Details Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Something went wrong loading course details. Please try again later.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};
