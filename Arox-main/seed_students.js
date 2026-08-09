const { getDb } = require('./config/database');
const bcrypt = require('bcryptjs');

const studentsData = [
  { first: 'Aarav', last: 'Sharma', gender: 'male', phone: '9876543210' },
  { first: 'Priya', last: 'Patel', gender: 'female', phone: '9876543211' },
  { first: 'Rahul', last: 'Verma', gender: 'male', phone: '9876543212' },
  { first: 'Sneha', last: 'Reddy', gender: 'female', phone: '9876543213' },
  { first: 'Aditya', last: 'Singh', gender: 'male', phone: '9876543214' },
  { first: 'Kavya', last: 'Iyer', gender: 'female', phone: '9876543215' },
  { first: 'Vikram', last: 'Joshi', gender: 'male', phone: '9876543216' },
  { first: 'Neha', last: 'Gupta', gender: 'female', phone: '9876543217' },
  { first: 'Rohan', last: 'Desai', gender: 'male', phone: '9876543218' },
  { first: 'Ananya', last: 'Nair', gender: 'female', phone: '9876543219' }
];

async function seed() {
  const db = getDb();
  
  // Find default course or create one
  let course = db.prepare("SELECT id FROM courses LIMIT 1").get();
  if (!course) {
    db.prepare(`
      INSERT INTO courses (slug, title, duration, price, category, is_active)
      VALUES ('full-stack-dev', 'Full Stack Development', '6 months', 15000, 'training', 1)
    `).run();
    course = db.prepare("SELECT id FROM courses LIMIT 1").get();
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  let idCounter = 100;

  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    const email = `${s.first.toLowerCase()}.${s.last.toLowerCase()}@example.com`;
    
    // Check if exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      console.log(`User ${email} already exists, skipping...`);
      continue;
    }

    // 1. Create User
    const maxUserId = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users").get().next_id;
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role_id, first_name, last_name, phone, status)
      VALUES (?, ?, ?, 3, ?, ?, ?, 'active')
    `).run(maxUserId, email, passwordHash, s.first, s.last, s.phone);
    
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    
    // 2. Create Student
    const maxStudentId = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM students").get().next_id;
    const studentId = `AT/INT/2026/${String(idCounter++).padStart(4, '0')}`;
    db.prepare(`
      INSERT INTO students (
        id, user_id, student_id, first_name, last_name, email, phone, gender, 
        college, university, degree, department, graduation_year, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ABC College', 'XYZ University', 'B.Tech', 'Computer Science', '2026', 'active')
    `).run(maxStudentId, user.id, studentId, s.first, s.last, email, s.phone, s.gender);
    
    const student = db.prepare("SELECT id FROM students WHERE user_id = ?").get(user.id);
    
    // 3. Create Registration
    const maxRegId = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM registrations").get().next_id;
    const regId = `REG-${Date.now()}-${i}`;
    db.prepare(`
      INSERT INTO registrations (
        id, registration_id, student_id, course_id, status, payment_plan, 
        total_amount, paid_amount, balance_amount
      ) VALUES (?, ?, ?, ?, 'confirmed', 'full', 15000, 15000, 0)
    `).run(maxRegId, regId, student.id, course.id);
    
    console.log(`Created student: ${s.first} ${s.last} (${studentId})`);
  }
  
  console.log("Seeding complete!");
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
