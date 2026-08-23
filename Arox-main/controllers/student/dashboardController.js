const { getDb } = require('../../config/database');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const db = getDb();
    
    // Find student record associated with user
    const student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
    
    if (!student) {
      // If student profile doesn't exist yet, render with minimal data
      return res.render('student/dashboard', {
        layout: 'layouts/student',
        title: 'Student Dashboard | AROX ERP',
        pageTitle: 'Dashboard',
        user: req.user,
        student: null,
        stats: { enrolled: 0, completed: 0, attendance: 100, pendingPayments: 0 },
        courses: [],
        enrollments: [],
        recentPayments: [],
        upcomingClasses: [],
        latestRegistration: null
      });
    }

    // 1. Course Stats
    const enrolledRow = db.prepare(`
      SELECT COUNT(*) as count FROM registrations 
      WHERE student_id = ? AND status IN ('confirmed', 'active')
    `).get(student.id);
    const enrolledCount = enrolledRow ? parseInt(enrolledRow.count, 10) || 0 : 0;

    const completedRow = db.prepare(`
      SELECT COUNT(*) as count FROM registrations 
      WHERE student_id = ? AND status = 'completed'
    `).get(student.id);
    const completedCount = completedRow ? parseInt(completedRow.count, 10) || 0 : 0;

    // 2. Attendance Stats
    const attendanceRow = db.prepare(`
      SELECT COUNT(*) as total, SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present 
      FROM attendance WHERE student_id = ?
    `).get(student.id);
    
    const totalAttendance = attendanceRow ? parseInt(attendanceRow.total, 10) || 0 : 0;
    const presentAttendance = attendanceRow ? parseInt(attendanceRow.present, 10) || 0 : 0;
    
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 100; // default 100% if no records yet

    // 3. Pending Payments sum
    const paymentRow = db.prepare(`
      SELECT SUM(balance_amount) as pending FROM registrations 
      WHERE student_id = ? AND status IN ('confirmed', 'active')
    `).get(student.id);
    const pendingPayments = paymentRow && paymentRow.pending ? parseFloat(paymentRow.pending) || 0 : 0;

    // 4. Enrolled Courses
    const courses = db.prepare(`
      SELECT r.id, r.registration_id as reg_display_id, r.status, 
             r.balance_amount, r.paid_amount, r.total_amount,
             c.id as course_id, c.title as course_title, c.slug, c.category, c.duration, c.batch_name, c.start_date
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `).all(student.id);

    // 5. Recent Payments
    const recentPayments = db.prepare(`
      SELECT p.*, c.title as course_title
      FROM payments p
      JOIN registrations r ON p.registration_id = r.id
      JOIN courses c ON r.course_id = c.id
      WHERE p.student_id = ?
      ORDER BY p.paid_at DESC, p.created_at DESC
      LIMIT 5
    `).all(student.id);

    // 6. Latest Registration (for offer letter banner)
    const latestRegistration = db.prepare(`
      SELECT registration_id, offer_letter_generated, offer_letter_path
      FROM registrations
      WHERE student_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(student.id);

    // 7. Upcoming Classes — derive from enrolled courses with start dates
    let upcomingClasses = [];
    try {
      upcomingClasses = courses
        .filter(c => c.start_date)
        .map(c => {
          const startDate = new Date(c.start_date);
          const now = new Date();
          // Find next upcoming class date (weekly recurrence from start_date)
          let classDate = new Date(startDate);
          // Advance to the next future date
          while (classDate < now) {
            classDate.setDate(classDate.getDate() + 7);
          }
          return {
            course_title: c.course_title,
            date: classDate,
            month: classDate.toLocaleString('en-IN', { month: 'short' }).toUpperCase(),
            day: classDate.getDate(),
            time: '10:00 AM - 12:00 PM'
          };
        })
        .sort((a, b) => a.date - b.date)
        .slice(0, 3);
    } catch (e) {
      logger.warn('Could not compute upcoming classes:', e.message);
    }

    res.render('student/dashboard', {
      layout: 'layouts/student',
      title: 'Student Dashboard | AROX ERP',
      pageTitle: 'Overview',
      user: req.user,
      student,
      stats: {
        enrolled: enrolledCount,
        completed: completedCount,
        attendance: attendanceRate,
        pendingPayments
      },
      courses,
      enrollments: courses,
      recentPayments,
      latestRegistration,
      upcomingClasses
    });
  } catch (error) {
    logger.error('Student Dashboard Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/student',
      title: 'Error - Student Portal',
      code: 500,
      message: 'Something went wrong loading your dashboard. Please try again later.',
      user: req.user || { first_name: 'Student', last_name: '', role: 'student' }
    });
  }
};
