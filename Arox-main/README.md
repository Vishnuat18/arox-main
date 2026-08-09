# AROX ERP — Internship & Training Management System

A premium, enterprise-grade ERP platform for managing internships and training programs. Designed with a clean SaaS aesthetic combining features of Linear, Vercel, and Stripe.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
arox-erp/
├── config/              # App, auth, and database configurations
├── controllers/         # Request handlers (MVC controllers)
│   ├── admin/           # Admin panel controllers (dashboard, students, courses, users, etc.)
│   └── student/         # Student portal controllers (dashboard, courses, payments, profile)
├── database/            # Schema, seed data, migrations, sql.js wrapper
├── middleware/          # Auth, roleGuard, upload, validation, errorHandler
├── models/              # Data models (User, Student, Course, Internship, etc.)
├── public/              # Static public folder
│   ├── css/             # Stylesheets (style.css, admin.css, student.css, animations.css)
│   ├── js/              # Client JavaScript (app.js, admin.js, student.js, wizard.js)
│   └── uploads/         # User uploads (photos, submissions, documents)
├── routes/              # Express routing paths
│   ├── api/             # API routes (auth, courses, registrations, payments, student)
│   └── web/             # EJS page rendering routes (pages, admin, student)
├── services/            # Background helper services (email, payments, PDF generator)
├── utils/               # App utilities (logger, helpers, QR generator)
├── views/               # EJS template engine directory
│   ├── admin/           # Admin dashboard views
│   ├── layouts/         # Base layout templates (main, admin, student)
│   ├── partials/        # Reusable view fragments (nav, footer)
│   ├── student/         # Student portal views
│   └── website/         # Public marketing pages & login UI
├── .env                 # Environment configurations
├── package.json         # Dependency tree
└── server.js            # Main application bootstrap
```

---

## 🔧 Tech Stack

| Layer      | Technology                  |
|------------|----------------------------|
| Frontend   | HTML5, Tailwind CSS, ES6+ JavaScript |
| Backend    | Node.js, Express.js        |
| Database   | SQLite (loaded via `sql.js` WASM) |
| Auth       | JWT (using Cookies), bcrypt |
| Templates  | EJS (with `express-ejs-layouts`) |
| PDF        | PDFKit (Offer letters, receipts) |
| Uploads    | Multer (Avatar photos, assignments submissions) |

---

## 🔐 Default Administrator Credentials

Use these credentials to access the secure Admin Dashboard:

* **Email:** `admin@aroxtech.com`
* **Password:** `Admin@123`

---

## 🌐 Routes Map

### Public Website
| Page            | URL                    | Access |
|----------------|------------------------|--------|
| Home            | `/`                    | Public |
| Internships     | `/internships`         | Public |
| Training        | `/training`            | Public |
| Course Details  | `/course/:slug`        | Public |
| Application     | `/apply` or `/apply/:courseSlug` | Public |
| About Us        | `/about`               | Public |
| Contact Us      | `/contact`             | Public |
| Login Portal    | `/login`               | Public |

### Admin ERP Dashboard
All admin routes are protected by `authenticate` and `roleGuard('admin', 'super_admin', 'trainer')` middlewares.

| Module | URL | Description |
|--------|-----|-------------|
| Overview | `/admin/dashboard` | Main metrics overview & trends charts |
| Registrations | `/admin/registrations` | View registrations, edit states, verify documents |
| Students | `/admin/students` | Detailed records of enrolled students |
| Courses | `/admin/courses` | Create and modify active programs & batches |
| Payments | `/admin/payments` | Consolidated invoice and transactions records |
| Users | `/admin/users` | Add staff members, update roles, edit status (Admin Only) |
| Settings | `/admin/settings` | App settings configurations (Admin Only) |

### Student Portal
All student routes are protected by `authenticate` and `roleGuard('student')` middlewares.

| Module | URL | Description |
|--------|-----|-------------|
| Overview | `/student/dashboard` | Progress stats, recent payments, course schedules |
| My Courses | `/student/courses` | Grid of enrolled programs |
| Course Details | `/student/courses/:id` | Curriculum, Assignments upload, Projects links submit, Attendance history, Certificate verify & download |
| Payments | `/student/payments` | Invoice summary, transaction details, receipt PDF downloads |
| Settings | `/student/profile` | Personal details update, avatar upload, password changes |

---

## 📡 API Endpoints Map

### General & Auth API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/login` | Log in user, sets Cookie JWT |
| POST   | `/api/auth/register` | Register student user account |
| POST   | `/api/auth/logout` | Clear token cookies |
| GET    | `/api/courses` | Fetch JSON list of active courses |
| GET    | `/api/courses/:slug` | Fetch course details by slug |
| POST   | `/api/registrations` | Create new course application |
| POST   | `/api/payments` | Mock pay processing & balance adjustment |
| POST   | `/api/payments/verify-coupon` | Validate coupon discounts |
| POST   | `/api/contact` | Submit contact form messages |

### Student Action API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/student/assignment/submit` | Upload student assignment file (via Multer) |
| POST   | `/api/student/project/submit` | Submit project metadata (Github, live URL) |
| POST   | `/api/student/profile/update` | Update personal details & upload avatar profile photo |
| POST   | `/api/student/profile/password` | Verify and change login passwords |

---

## 🎨 Styling & Design Guidelines

- **Primary Colors:** `#4F46E5` (Indigo Primary), `#7C3AED` (Purple Secondary), `#06B6D4` (Cyan Accent)
- **Typography:** Uses the `Inter` font family (rendered from Google Fonts).
- **Cards & Badges:** Rounded borders (`var(--radius-xl)` / `var(--radius-2xl)`), glassmorphism transparency, and soft blurred shadows.
- **Animations:** Floating keyframe actions, fade-in transitions, page loaders, and error form shaking effect.

---

## 📄 License

MIT © AROX Tech Pvt. Ltd.
