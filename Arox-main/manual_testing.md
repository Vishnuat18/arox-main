# AROX ERP — Manual Testing & Error Handling Guide

This guide outlines manual test cases and procedures to verify error handling, role-based access control, inputs validation, file upload limits, and network/server exceptions in AROX ERP. Use this guide during QA runs or before shipping updates to production.

---

## 📁 Test Case Index

1. [Authentication & Account Errors](#1-authentication--account-errors)
2. [Authorization & Role Guard (403 Forbidden)](#2-authorization--role-guard-403-forbidden)
3. [Registration Wizard & Coupon Validation](#3-registration-wizard--coupon-validation)
4. [File Uploads & Limit Restrictions (Multer)](#4-file-uploads--limit-restrictions-multer)
5. [Route Parameters & Data Ownership Manipulation](#5-route-parameters--data-ownership-manipulation)
6. [Global Error Views (404 and 500 templates)](#6-global-error-views-404-and-500-templates)
7. [System Exceptions & Recovery (e.g., PORT In-Use)](#7-system-exceptions--recovery-eg-port-in-use)

---

## 1. Authentication & Account Errors

### TC-AUTH-01: Invalid Credentials Login
* **Pre-conditions:** App is running.
* **Steps:**
  1. Navigate to `/login`.
  2. Enter Email: `admin@aroxtech.com`
  3. Enter Password: `IncorrectPassword123`
  4. Click **Sign In**.
* **Expected Result:**
  - Login fails.
  - The login card performs a shake animation.
  - An error message "Invalid email or password." is displayed inside a red banner.
  - No redirect occurs, and inputs remain.

### TC-AUTH-02: Suspended/Inactive User
* **Pre-conditions:** A user exists with status `suspended` or `inactive`. (Can be updated via Admin Panel users table or direct SQL query: `UPDATE users SET status = 'suspended' WHERE email = '...'`).
* **Steps:**
  1. Navigate to `/login`.
  2. Enter the suspended user's email and password.
  3. Click **Sign In**.
* **Expected Result:**
  - Red error banner displays: "Your account is inactive. Please contact support."
  - HTTP response code returned is `403 Forbidden`.

### TC-AUTH-03: Registering Existing Email
* **Pre-conditions:** A student with email `student@example.com` already exists.
* **Steps:**
  1. Navigate to the application registration flow.
  2. Attempt to register a new account with the email `student@example.com`.
* **Expected Result:**
  - Server returns HTTP status `409 Conflict`.
  - Error banner displays: "An account with this email already exists."

---

## 2. Authorization & Role Guard (403 Forbidden)

### TC-AUTH-04: Unauthorized Area Access (Guest)
* **Pre-conditions:** User is logged out.
* **Steps:**
  1. Directly navigate to `http://localhost:3000/admin/dashboard`.
  2. Directly navigate to `http://localhost:3000/student/dashboard`.
* **Expected Result:**
  - Guest is blocked from both endpoints.
  - Browser is immediately redirected to the `/login` portal.

### TC-AUTH-05: Student Accessing Admin Panel
* **Pre-conditions:** Student user is logged in.
* **Steps:**
  1. In the browser address bar, type: `http://localhost:3000/admin/dashboard`.
* **Expected Result:**
  - Access is denied.
  - Browser renders the custom `views/website/error.ejs` template.
  - Display Code: `403`.
  - Display Message: "You do not have permission to access this page."

---

## 3. Registration Wizard & Coupon Validation

### TC-VAL-01: Empty Required Fields
* **Pre-conditions:** User is on the `/apply` wizard.
* **Steps:**
  1. Leave required fields (First Name, Email, Phone) empty.
  2. Click **Next** or **Submit**.
* **Expected Result:**
  - Frontend browser validation prevents form submission (showing browser tooltip: "Please fill out this field").
  - If bypassed (via DevTools or raw API post), the server validation middleware returns HTTP `400 Bad Request` listing missing parameters.

### TC-VAL-02: Invalid Coupon Code
* **Pre-conditions:** Applying for a course.
* **Steps:**
  1. In the coupon section, type `FAKECOUPON` and click **Apply**.
* **Expected Result:**
  - Displayed warning: "Invalid coupon code."
  - Discount is not applied; original amount remains unchanged.

---

## 4. File Uploads & Limit Restrictions (Multer)

### TC-FILE-01: File Size Limit Exceeded
* **Pre-conditions:** Student is logged in and on their Profile Settings page.
* **Steps:**
  1. Click **Choose Image** for the Profile Picture.
  2. Choose an image file larger than **2MB** (e.g., a 5MB raw image).
  3. Click **Save Settings**.
* **Expected Result:**
  - The upload process fails.
  - Alert banner displays: "File too large" or "File size limit exceeded."
  - HTTP `500` or `400` error is caught in the controller.

### TC-FILE-02: Invalid File Extension (Submissions)
* **Pre-conditions:** Student is on the course details submission page.
* **Steps:**
  1. Try to upload a script executable or invalid type (e.g. `test.exe`, `test.mp4`).
  2. Click **Submit Assignment**.
* **Expected Result:**
  - The `fileFilter` in `middleware/upload.js` blocks the request.
  - Toast notification appears: "File type .exe is not allowed for submission uploads."
  - File is not written to `public/uploads/submissions/`.

---

## 5. Route Parameters & Data Ownership Manipulation

### TC-ROUTE-01: Accessing Non-existent Resource IDs
* **Pre-conditions:** Admin or Student is logged in.
* **Steps:**
  1. Navigate to `/admin/students/99999` (an ID that does not exist in the database).
  2. Navigate to `/student/courses/99999`.
* **Expected Result:**
  - Browser displays custom 404 page: "Student not found" or "Registration not found or access denied."
  - The application does not crash, and logs the database select mismatch.

### TC-ROUTE-02: Crossing Student Data (ID Spoofing)
* **Pre-conditions:** Logged in as **Student A** (whose registration ID is `1`).
* **Steps:**
  1. Manually edit the browser address bar to view another student's registration: `/student/courses/2` (where `2` belongs to Student B).
* **Expected Result:**
  - The query checks: `WHERE r.id = ? AND r.student_id = ?` (verifying ownership).
  - Page returns `404 Not Found` error.
  - Student A is blocked from seeing Student B's courses or details.

---

## 6. Global Error Views (404 and 500 templates)

### TC-ERR-01: Page Not Found (404)
* **Steps:**
  1. Navigate to `http://localhost:3000/some-random-page-name`.
* **Expected Result:**
  - Application renders `views/website/error.ejs`.
  - Display Code: `404`.
  - Message: "Page Not Found."

### TC-ERR-02: Simulating Server Code Crashing (500)
* **Steps:**
  1. Temporarily disrupt the database configuration (e.g., rename `arox.db` file) or inject a syntax error inside `controllers/pageController.js`.
  2. Navigate to the website home page `/`.
* **Expected Result:**
  - Page renders custom 500 error display.
  - Displays code `500` with the message: "Internal server error" or similar friendly guidance.
  - Detailed errors are written to server logs but hidden from users.

---

## 7. System Exceptions & Recovery (e.g., PORT In-Use)

### TC-SYS-01: EADDRINUSE Port Collision
* **Pre-conditions:** Node server is currently running.
* **Steps:**
  1. Open a second terminal and attempt to launch the server again: `npm run dev`.
* **Expected Result:**
  - Node throws an unhandled `listen EADDRINUSE: address already in use :::3000`.
* **Mitigation / Recovery Procedure:**
  1. Identify the process ID running on port 3000:
     ```powershell
     Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
     ```
  2. Terminate the process:
     ```powershell
     Stop-Process -Id <OwningProcessId> -Force
     ```
  3. Restart nodemon: `npm run dev`.
