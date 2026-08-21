# AROX ERP - Comprehensive Testing Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Setup & Installation](#setup--installation)
3. [Authentication Testing](#authentication-testing)
4. [Admin Dashboard Testing](#admin-dashboard-testing)
5. [Document Generators Testing](#document-generators-testing)
6. [Document Hub Testing](#document-hub-testing)
7. [Student Portal Testing](#student-portal-testing)
8. [Error Handling Testing](#error-handling-testing)
9. [Responsive Design Testing](#responsive-design-testing)

---

## System Requirements
- Node.js 18+ 
- Modern browser (Chrome, Firefox, Edge)
- Screen resolution: 1280x720 minimum (1920x1080 recommended)

---

## Setup & Installation

### Step 1: Install Dependencies
```bash
cd Arox-main
npm install
```

### Step 2: Start Server
```bash
node server.js
```

### Step 3: Verify Server
- Open browser to `http://localhost:3000`
- You should see the AROX website homepage
- Check console for: `🚀 AROX ERP Server Running`

---

## Authentication Testing

### Test 1: Login Page Load
- [ ] Navigate to `/login`
- [ ] Page renders with the role switcher (Student / Admin / Employee tabs)
- [ ] Background image loads correctly
- [ ] AROX logo is visible
- [ ] "Back to Home" button is present and works

### Test 2: Student Login
- [ ] Click the "Student" tab on the role switcher
- [ ] Email field auto-fills to `student@arox.com`
- [ ] Password field auto-fills to `student123`
- [ ] Button text shows "Sign In as Student"
- [ ] Click "Sign In as Student"
- [ ] Redirects to `/student/dashboard`
- [ ] Welcome message shows student's name

### Test 3: Admin Login
- [ ] Click the "Admin" tab
- [ ] Email changes to `admin@arox.com`
- [ ] Password changes to `admin123`
- [ ] Button text shows "Sign In as Admin"
- [ ] Click "Sign In as Admin"
- [ ] Redirects to `/admin/dashboard`
- [ ] Admin name and role visible in top bar

### Test 4: Employee/Trainer Login
- [ ] Click the "Employee" tab
- [ ] Email changes to `employee@arox.com`
- [ ] Password changes to `employee123`
- [ ] Button text shows "Sign In as Employee"
- [ ] Click "Sign In as Employee"
- [ ] Redirects to `/admin/dashboard`

### Test 5: Invalid Login
- [ ] Enter invalid email/password combination
- [ ] Error message appears in red box
- [ ] "Sign In" button re-enables after error
- [ ] No redirect occurs

### Test 6: Password Toggle
- [ ] Click the eye icon next to password field
- [ ] Password becomes visible (text input)
- [ ] Click eye icon again
- [ ] Password hides (password input)

### Test 7: Logout
- [ ] Click "Logout" in sidebar
- [ ] Session is terminated
- [ ] Redirected to login or home page
- [ ] Cannot access protected routes after logout

---

## Admin Dashboard Testing

### Test 8: Dashboard Overview
- [ ] Login as admin
- [ ] Dashboard loads with stats cards (Students, Courses, Registrations, Revenue)
- [ ] Recent registrations table is populated
- [ ] Upcoming batches section loads
- [ ] All lucide icons render correctly

### Test 9: Sidebar Navigation
- [ ] All sidebar links are clickable
- [ ] Active page is highlighted in sidebar
- [ ] Sidebar toggle (collapse/expand) works
- [ ] Collapsed state persists on page reload
- [ ] Logout button works from sidebar

### Test 10: Students Page
- [ ] Navigate to `/admin/students`
- [ ] Students list loads with all columns
- [ ] Click on a student to view profile
- [ ] Student profile shows all details
- [ ] Back button returns to list

### Test 11: Registrations Page
- [ ] Navigate to `/admin/registrations`
- [ ] Registration list loads
- [ ] Status badges show correct colors
- [ ] Click on a registration to view details
- [ ] Payments list shows in registration detail

### Test 12: Courses Page
- [ ] Navigate to `/admin/courses`
- [ ] Course list loads with enrollment counts
- [ ] Course cards show correct status

### Test 13: Payments Page
- [ ] Navigate to `/admin/payments`
- [ ] Payment history loads
- [ ] All payment details are correct

---

## Document Generators Testing

### Test 14: Certificate Generator
- [ ] Navigate to `/admin/document-hub` or use the Document Hub
- [ ] Certificate Generator preview panel loads
- [ ] Preview shows full certificate (landscape A4 format)
- [ ] Certificate is centered in preview area
- [ ] No scrollbars on the preview (certificate fits)
- [ ] "Live Preview" label is visible in top-left corner
- [ ] 3 action buttons at bottom: Download PDF, Fullscreen, Print

#### Form Interaction
- [ ] Change student name → preview updates in real-time
- [ ] Change domain from dropdown → preview updates
- [ ] Change issue date → preview updates
- [ ] Change certificate ID fields → preview updates
- [ ] Change appreciation text → preview updates
- [ ] Certificate ID auto-generates from year + number fields

#### Action Buttons
- [ ] "Download PDF" button triggers PDF download
- [ ] "Fullscreen" button opens modal with full certificate view
- [ ] "Print" button opens print dialog
- [ ] Fullscreen modal close button (×) works
- [ ] Fullscreen modal backdrop click closes modal

### Test 15: Offer Letter Generator
- [ ] Navigate to Offer Letter Generator
- [ ] Preview panel loads with offer letter
- [ ] Preview is scrollable (offer letters may be longer)
- [ ] "Live Preview" label visible
- [ ] 3 action buttons at bottom

#### Form Interaction
- [ ] Change candidate name → preview updates
- [ ] Change address/college → preview updates
- [ ] Change role title → preview updates
- [ ] Change location → preview updates
- [ ] Change start/end dates → preview updates
- [ ] Change stipend amount → preview updates
- [ ] Change signatory name → preview updates

### Test 16: Attendance Generator
- [ ] Navigate to Attendance Generator
- [ ] Preview panel loads
- [ ] Preview is scrollable for >30 day attendance sheets
- [ ] "Live Preview" label visible
- [ ] 3 action buttons at bottom

#### Form Interaction
- [ ] Change candidate name → preview updates
- [ ] Change college name → preview updates
- [ ] Change department → preview updates
- [ ] Change year → preview updates
- [ ] Change internship/course → preview updates
- [ ] Change month → preview updates
- [ ] Change total days → preview updates (table grows/shrinks)

### Test 17: Project Certificate Generator
- [ ] Navigate to Project Certificate Generator
- [ ] Preview panel loads with certificate
- [ ] Certificate fits in preview (no scrollbars)
- [ ] "Live Preview" label visible
- [ ] 3 action buttons at bottom

#### Form Interaction
- [ ] Change certificate ID → preview updates
- [ ] Change date of issue → preview updates
- [ ] Change student name → preview updates
- [ ] Change project title → preview updates
- [ ] Change start/end dates → preview updates

---

## Document Hub Testing

### Test 18: Hub Layout
- [ ] Navigate to `/admin/document-hub`
- [ ] 3-column layout loads (Student Select | Document Hub | Preview)
- [ ] Student dropdown is populated with students
- [ ] Document list shows 4 document types
- [ ] Preview area shows "Select a document to preview" placeholder

### Test 19: Student Selection
- [ ] Select a student from dropdown
- [ ] Student card updates with name, ID, course, batch, payment status
- [ ] "View Full Profile" button navigates to student profile
- [ ] Validation badge shows "Eligible for Generation"

### Test 20: Document Multi-Select
- [ ] Click on "Offer Letter" → checkbox appears, card highlights in blue
- [ ] Click on "Completion Certificate" → second card also highlighted
- [ ] Selected count badge shows "2" in Document Hub title
- [ ] Selected count bar appears below student card
- [ ] Click a selected document again → deselects it
- [ ] Click "Download Selected as ZIP" with selections → ZIP downloads

### Test 21: Document Preview in Hub
- [ ] Select a student first
- [ ] Click on "Completion Certificate" document
- [ ] Preview panel loads the certificate in iframe
- [ ] Certificate scales to fit the preview area (no scrollbars)
- [ ] Certificate is centered and fully visible
- [ ] "Live Preview" area shows the full certificate
- [ ] 3 action buttons appear at bottom of preview

### Test 22: Hub Preview Actions
- [ ] Zoom in (+) button increases preview size
- [ ] Zoom out (-) button decreases preview size
- [ ] Reset zoom button returns to 100%
- [ ] Fullscreen button opens modal with large preview
- [ ] Fullscreen close button works

### Test 23: Hub Bottom Action Bar
- [ ] "Generate" button works (generates + logs download)
- [ ] "Download" button triggers PDF download
- [ ] "Email" button shows toast notification
- [ ] "WhatsApp" button shows toast notification
- [ ] "Save to Portal" button shows toast notification

### Test 24: ZIP Download
- [ ] Select multiple documents (checkboxes)
- [ ] Click "Download Selected as ZIP"
- [ ] ZIP file downloads with student name prefix
- [ ] ZIP contains PDF files for each selected document
- [ ] Toast shows "ZIP download complete!"

---

## Student Portal Testing

### Test 25: Student Dashboard
- [ ] Login as student
- [ ] Dashboard loads with 4 stat cards
- [ ] Enrolled Courses count shows correctly
- [ ] Overall Progress bar displays
- [ ] My Courses section shows enrolled courses
- [ ] Upcoming Classes section shows schedule

### Test 26: Offer Letter Modal (First Visit)
- [ ] First time logging in → offer letter modal appears
- [ ] Modal has gradient header with welcome message
- [ ] Form fields pre-fill with student data (name, college, department)
- [ ] Domain dropdown has all options
- [ ] "Confirm & Generate" button submits form
- [ ] "Skip for now" button closes modal
- [ ] After dismissing → modal does not show again on reload
- [ ] Modal stores dismissal in localStorage per student

### Test 27: Student Offer Letter Download
- [ ] When registration exists with offer letter → banner shows
- [ ] "Download Offer Letter" button opens offer letter PDF
- [ ] Banner shows welcome message with student's name

### Test 28: Student Navigation
- [ ] "Overview" link → dashboard
- [ ] "My Courses" link → courses list
- [ ] "Payments" link → payment history
- [ ] "Profile" link → profile settings
- [ ] "Back to Website" link → homepage
- [ ] "Logout" link → session ends

---

## Error Handling Testing

### Test 29: 404 Page
- [ ] Navigate to `/nonexistent-page`
- [ ] Error page shows with code "404"
- [ ] "Page Not Found" heading
- [ ] Blue icon (search) is displayed
- [ ] "Back to Home" button works
- [ ] "Go Back" button returns to previous page
- [ ] Error page uses main layout (navbar visible)

### Test 30: 500 Error Page
- [ ] Trigger a server error (e.g., invalid route parameter)
- [ ] Error page shows with code "500"
- [ ] "Something Went Wrong" heading
- [ ] Red icon (alert-triangle) is displayed
- [ ] Error message is shown
- [ ] "Back to Home" and "Go Back" buttons work

### Test 31: 403 Forbidden Page
- [ ] Login as student
- [ ] Navigate to `/admin/dashboard` (forbidden)
- [ ] Error page shows with code "403"
- [ ] "Access Denied" heading
- [ ] Message explains permission issue

### Test 32: 501 Coming Soon Page
- [ ] Navigate to `/admin/settings`
- [ ] Error page shows with code "501"
- [ ] "Coming Soon" heading
- [ ] Orange icon (construction) is displayed
- [ ] Message says feature is under development

### Test 33: Error Page Consistency
- [ ] All error pages have consistent styling
- [ ] Error pages use the correct layout (admin/student/main)
- [ ] Lucide icons render correctly on error pages
- [ ] Error pages are responsive on mobile

---

## Responsive Design Testing

### Test 34: Login Page Responsive
- [ ] Login card centers on all screen sizes
- [ ] Role switcher tabs remain clickable on mobile
- [ ] Form inputs are full-width on small screens
- [ ] Background image scales properly

### Test 35: Admin Dashboard Responsive
- [ ] Sidebar collapses on smaller screens
- [ ] Stats cards stack vertically on mobile
- [ ] Tables become scrollable horizontally
- [ ] Navigation remains accessible

### Test 36: Generator Pages Responsive
- [ ] Form panel and preview panel stack on mobile
- [ ] Preview remains visible (may need scrolling)
- [ ] Action buttons remain clickable
- [ ] Form inputs are usable on touch devices

### Test 37: Document Hub Responsive
- [ ] 3-column layout stacks on tablet/mobile
- [ ] Student selection remains accessible
- [ ] Document list is scrollable
- [ ] Preview area adjusts to available space

---

## Browser Compatibility Testing

### Test 38: Chrome (Latest)
- [ ] All pages render correctly
- [ ] Iframes load properly
- [ ] PDF generation works
- [ ] LocalStorage operations work

### Test 39: Firefox (Latest)
- [ ] All pages render correctly
- [ ] CSS grid/flex layouts work
- [ ] Form submissions work

### Test 40: Edge (Latest)
- [ ] All pages render correctly
- [ ] Active Directory SSO compatible (if applicable)
- [ ] PDF generation works

---

## Performance Testing

### Test 41: Page Load Times
- [ ] Login page loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] Generator previews load in < 3 seconds
- [ ] Document Hub loads in < 3 seconds

### Test 42: Asset Loading
- [ ] CSS file (erp-theme.css) loads
- [ ] Lucide icons script loads
- [ ] Tailwind CSS loads
- [ ] Chart.js loads on dashboard
- [ ] Google Fonts (Montserrat) load

---

## API Testing

### Test 43: Auth API
- [ ] `POST /api/auth/login` → returns JWT token
- [ ] `POST /api/auth/logout` → clears cookie
- [ ] `GET /api/auth/me` → returns current user

### Test 44: Students API
- [ ] `GET /api/students` → returns student list with attendance
- [ ] Response includes all required fields

### Test 45: Registrations API
- [ ] `POST /api/registrations/check-download` → returns download status
- [ ] `POST /api/registrations/log-download` → logs download

### Test 46: Courses API
- [ ] `GET /api/courses` → returns course list
- [ ] Response includes enrollment counts

---

## Data Integrity Testing

### Test 47: Certificate Data
- [ ] Certificate ID format: AT/INT/YYYY/NNNN
- [ ] Student name renders correctly (no truncation)
- [ ] Dates format correctly (DD MMM YYYY)
- [ ] QR code generates with verification URL

### Test 48: Offer Letter Data
- [ ] All form fields map correctly to letter content
- [ ] Date ranges are logical (start before end)
- [ ] Stipend amount displays with currency symbol

### Test 49: Attendance Data
- [ ] Total days matches attendance table rows
- [ ] Present/Absent counts are accurate
- [ ] Attendance percentage calculates correctly

---

## Regression Testing Checklist

After any code changes, verify:
- [ ] Login flow works for all 3 roles
- [ ] Dashboard loads without errors for admin and student
- [ ] All 4 generators show correct previews
- [ ] Document Hub multi-select works
- [ ] ZIP download generates valid ZIP file
- [ ] Error pages render with correct layouts
- [ ] Offer letter modal shows on first student login
- [ ] Sidebar navigation works (with and without collapse)
- [ ] All lucide icons render (no broken icons)
- [ ] No console errors on any page

---

## Bug Reporting Template

When reporting a bug, include:
1. **Page/URL**: Which page were you on?
2. **Steps to Reproduce**: What did you do?
3. **Expected**: What should have happened?
4. **Actual**: What actually happened?
5. **Screenshot**: Visual evidence if possible
6. **Browser**: Chrome/Firefox/Edge + version
7. **Console Errors**: Any errors in browser console?

---

## Known Issues & Workarounds

1. **Iframe Certificate Preview**: Some certificate HTML pages have their own flex layout that may affect scaling. If preview looks off, try the Fullscreen button.
2. **PDF Generation**: Relies on html2canvas + jsPDF. Very large attendance sheets (>30 days) may take a few seconds.
3. **ZIP Download**: Uses JSZip library loaded from CDN. Requires internet connection for first load.
4. **Offer Letter Modal**: Dismissal is per-student using localStorage. Clearing browser storage will show it again.
5. **Template Links Removed**: The "Templates" section was removed from the admin sidebar. All generators are now accessed through the Document Hub.

---

*Last Updated: August 2026*
*AROX ERP v3.6*
