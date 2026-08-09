-- ============================================
-- AROX ERP Database Schema
-- PostgreSQL-compatible (running on SQLite)
-- ============================================

-- Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Users (authentication)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id INTEGER NOT NULL DEFAULT 3,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','suspended','pending')),
  email_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires DATETIME,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  student_id TEXT NOT NULL UNIQUE,
  photo TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('male','female','other')),
  dob DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  -- College info
  college TEXT,
  university TEXT,
  degree TEXT,
  department TEXT,
  year_of_study TEXT,
  graduation_year TEXT,
  roll_number TEXT,
  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','completed','dropped')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'training',
  image TEXT,
  duration TEXT NOT NULL,
  duration_weeks INTEGER DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  discounted_price REAL,
  mode TEXT DEFAULT 'online' CHECK(mode IN ('online','offline','hybrid')),
  level TEXT DEFAULT 'beginner' CHECK(level IN ('beginner','intermediate','advanced')),
  has_certificate INTEGER DEFAULT 1,
  certificate_type TEXT DEFAULT 'completion',
  rating REAL DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  total_enrolled INTEGER DEFAULT 0,
  max_students INTEGER DEFAULT 50,
  curriculum TEXT, -- JSON string
  skills TEXT, -- JSON string (array of skill names)
  projects TEXT, -- JSON string (array of project objects)
  prerequisites TEXT,
  faqs TEXT, -- JSON string
  trainer_name TEXT,
  trainer_title TEXT,
  trainer_bio TEXT,
  trainer_photo TEXT,
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  batch_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Internships (linked to courses)
CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  company TEXT DEFAULT 'AROX Tech',
  description TEXT,
  image TEXT,
  domain TEXT,
  duration TEXT NOT NULL,
  stipend TEXT,
  mode TEXT DEFAULT 'online' CHECK(mode IN ('online','offline','hybrid')),
  has_certificate INTEGER DEFAULT 1,
  has_letter INTEGER DEFAULT 1,
  rating REAL DEFAULT 4.5,
  total_enrolled INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Registrations (enrollment)
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id TEXT NOT NULL UNIQUE,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  internship_id INTEGER,
  batch_name TEXT,
  start_date DATE,
  end_date DATE,
  mode TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','active','completed','cancelled','dropped')),
  payment_plan TEXT DEFAULT 'full' CHECK(payment_plan IN ('full','advance')),
  total_amount REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  balance_amount REAL NOT NULL DEFAULT 0,
  coupon_code TEXT,
  discount_amount REAL DEFAULT 0,
  gst_amount REAL DEFAULT 0,
  offer_letter_generated INTEGER DEFAULT 0,
  offer_letter_path TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (internship_id) REFERENCES internships(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id TEXT NOT NULL UNIQUE,
  registration_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  gst_amount REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  payment_method TEXT CHECK(payment_method IN ('upi','card','netbanking','cash','cheque','other')),
  payment_type TEXT DEFAULT 'full' CHECK(payment_type IN ('full','advance','balance','refund')),
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed','refunded')),
  invoice_number TEXT,
  invoice_path TEXT,
  receipt_path TEXT,
  notes TEXT,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK(status IN ('present','absent','late','leave','holiday')),
  check_in_time TEXT,
  check_out_time TEXT,
  method TEXT DEFAULT 'manual' CHECK(method IN ('manual','qr','online','gps')),
  remarks TEXT,
  marked_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (marked_by) REFERENCES users(id),
  UNIQUE(student_id, course_id, date)
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date DATETIME,
  max_marks INTEGER DEFAULT 100,
  attachment_path TEXT,
  is_active INTEGER DEFAULT 1,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  submission_path TEXT,
  submission_text TEXT,
  marks INTEGER,
  feedback TEXT,
  status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted','reviewed','graded','resubmit')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME,
  graded_by INTEGER,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id),
  UNIQUE(assignment_id, student_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  due_date DATETIME,
  max_marks INTEGER DEFAULT 100,
  is_active INTEGER DEFAULT 1,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  file_path TEXT,
  github_link TEXT,
  demo_link TEXT,
  marks INTEGER,
  feedback TEXT,
  status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted','under_review','approved','rejected','resubmit')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  UNIQUE(project_id, student_id)
);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('certificate','offer_letter','invoice','receipt')),
  content TEXT, -- HTML template content
  variables TEXT, -- JSON string of available variables
  is_default INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_id TEXT NOT NULL UNIQUE,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  registration_id INTEGER,
  type TEXT DEFAULT 'completion' CHECK(type IN ('offer_letter','completion','internship','attendance','project','excellence')),
  template_id INTEGER,
  title TEXT,
  issue_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  qr_code TEXT,
  file_path TEXT,
  verification_url TEXT,
  status TEXT DEFAULT 'generated' CHECK(status IN ('draft','generated','issued','revoked')),
  generated_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (registration_id) REFERENCES registrations(id),
  FOREIGN KEY (template_id) REFERENCES templates(id),
  FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT NOT NULL CHECK(type IN ('email','sms','push','whatsapp','system')),
  channel TEXT DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON
  is_read INTEGER DEFAULT 0,
  sent_at DATETIME,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  module TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT DEFAULT 'percentage' CHECK(discount_type IN ('percentage','fixed')),
  discount_value REAL NOT NULL,
  min_amount REAL DEFAULT 0,
  max_discount REAL,
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  valid_from DATE,
  valid_until DATE,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK(status IN ('new','read','replied','archived')),
  replied_at DATETIME,
  replied_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (replied_by) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_internships_slug ON internships(slug);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_course ON registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);

-- Certificate downloads logging for single-download constraint
CREATE TABLE IF NOT EXISTS certificate_downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  document_type TEXT NOT NULL,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, document_type)
);
CREATE INDEX IF NOT EXISTS idx_cert_downloads_student ON certificate_downloads(student_id);
