/**
 * AROX ERP - Student Portal Interactive JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Sidebar Toggle
  // ==========================================
  const sidebar = document.getElementById('student-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('mobile-open');
    });
  }

  // ==========================================
  // Custom Tab System for Course Details Page
  // ==========================================
  const tabs = document.querySelectorAll('.detail-tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.add('hidden'));

        tab.classList.add('active');
        const targetPanel = document.getElementById(target);
        if (targetPanel) {
          targetPanel.classList.remove('hidden');
        }
      });
    });
  }

  // ==========================================
  // Assignment & Project Form Submissions
  // ==========================================
  const assignmentForms = document.querySelectorAll('.assignment-submit-form');
  assignmentForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';

      const formData = new FormData(form);

      try {
        const res = await fetch('/api/student/assignment/submit', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.Toast.success('Success', 'Assignment submitted successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        window.Toast.error('Submission Failed', err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  });

  const projectForms = document.querySelectorAll('.project-submit-form');
  projectForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';

      const formData = new FormData(form);

      try {
        const res = await fetch('/api/student/project/submit', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.Toast.success('Success', 'Project submitted successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        window.Toast.error('Submission Failed', err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  });

  // ==========================================
  // Profile Updates
  // ==========================================
  const profileForm = document.getElementById('studentProfileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('saveProfileBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Saving...';

      const formData = new FormData(profileForm);

      try {
        const res = await fetch('/api/student/profile/update', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.Toast.success('Success', 'Profile updated successfully!');
          if (result.photo) {
            // Update photo in topbar avatar
            const navAvatar = document.getElementById('student-avatar-nav');
            if (navAvatar) {
              navAvatar.innerHTML = `<img src="${result.photo}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            }
          }
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error(result.message || 'Update failed');
        }
      } catch (err) {
        window.Toast.error('Error', err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // ==========================================
  // Password Changes
  // ==========================================
  const passwordForm = document.getElementById('studentPasswordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('changePassBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Updating...';

      const current_password = document.getElementById('current_password').value;
      const new_password = document.getElementById('new_password').value;
      const confirm_password = document.getElementById('confirm_password').value;

      if (new_password !== confirm_password) {
        window.Toast.error('Error', 'New passwords do not match!');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      try {
        const res = await fetch('/api/student/profile/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_password, new_password })
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.Toast.success('Success', 'Password updated successfully!');
          passwordForm.reset();
        } else {
          throw new Error(result.message || 'Password update failed');
        }
      } catch (err) {
        window.Toast.error('Error', err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});
