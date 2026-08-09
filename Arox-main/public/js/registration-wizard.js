/**
 * AROX ERP - Registration Wizard
 * 5-step multi-step form with validation, autosave, and smooth transitions
 */

const RegistrationWizard = {
  currentStep: 1,
  totalSteps: 5,
  formData: {},

  init() {
    this.loadSavedData();
    this.setupNavigation();
    this.setupValidation();
    this.setupPhotoUpload();
    this.setupPaymentPlan();
    this.setupCoupon();
    this.updateProgressBar();
    this.showStep(this.currentStep);
  },

  // Load saved data from localStorage
  loadSavedData() {
    const saved = localStorage.getItem('arox-registration');
    if (saved) {
      try {
        this.formData = JSON.parse(saved);
        this.populateFields();
      } catch (e) {
        this.formData = {};
      }
    }
  },

  // Save data to localStorage
  saveData() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      if (field.name && field.type !== 'file') {
        if (field.type === 'radio') {
          if (field.checked) this.formData[field.name] = field.value;
        } else {
          this.formData[field.name] = field.value;
        }
      }
    });

    localStorage.setItem('arox-registration', JSON.stringify(this.formData));
  },

  // Populate fields from saved data
  populateFields() {
    Object.entries(this.formData).forEach(([key, value]) => {
      const field = document.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'radio') {
          const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;
        } else {
          field.value = value;
        }
      }
    });
  },

  // Navigation
  setupNavigation() {
    document.querySelectorAll('[data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('[data-wizard-prev]').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    document.querySelectorAll('[data-wizard-submit]').forEach(btn => {
      btn.addEventListener('click', () => this.submitForm());
    });

    // Step indicators click
    document.querySelectorAll('.wizard-step-indicator').forEach(indicator => {
      indicator.addEventListener('click', () => {
        const step = parseInt(indicator.getAttribute('data-step'));
        if (step < this.currentStep) {
          this.showStep(step);
        }
      });
    });
  },

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;
    this.saveData();

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.showStep(this.currentStep);
      
      // Load course info for step 3
      if (this.currentStep === 3) {
        this.loadCourseInfo();
      }
      // Load payment summary for step 4
      if (this.currentStep === 4) {
        this.loadPaymentSummary();
      }
    }
  },

  prevStep() {
    this.saveData();
    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  },

  showStep(step) {
    this.currentStep = step;
    
    // Hide all panels
    document.querySelectorAll('.wizard-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // Show current panel
    const currentPanel = document.getElementById(`wizard-step-${step}`);
    if (currentPanel) {
      currentPanel.classList.add('active');
    }

    // Update indicators
    document.querySelectorAll('.wizard-step-indicator').forEach(indicator => {
      const s = parseInt(indicator.getAttribute('data-step'));
      indicator.classList.remove('active', 'completed');
      if (s === step) indicator.classList.add('active');
      if (s < step) indicator.classList.add('completed');
    });

    this.updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateProgressBar() {
    const bar = document.querySelector('.wizard-progress-bar');
    if (bar) {
      const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      const maxWidth = bar.parentElement.offsetWidth - 80;
      bar.style.width = `${(progress / 100) * maxWidth}px`;
    }
  },

  // Validation
  setupValidation() {
    // Real-time validation on input
    document.querySelectorAll('.wizard-panel input, .wizard-panel select, .wizard-panel textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', debounce(() => {
        if (field.classList.contains('error')) {
          this.validateField(field);
        }
        this.saveData();
      }, 300));
    });
  },

  validateStep(step) {
    const panel = document.getElementById(`wizard-step-${step}`);
    if (!panel) return true;

    const requiredFields = panel.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      Toast.error('Validation Error', 'Please fill in all required fields.');
      // Focus first error field
      const firstError = panel.querySelector('.error');
      if (firstError) firstError.focus();
    }

    return isValid;
  },

  validateField(field) {
    const value = field.value.trim();
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // Phone validation
    if (field.name === 'phone' && value) {
      const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
    }

    // Update UI
    field.classList.toggle('error', !isValid);
    field.classList.toggle('success', isValid && value);
    if (errorEl) {
      errorEl.textContent = errorMessage;
      errorEl.style.display = isValid ? 'none' : 'block';
    }

    return isValid;
  },

  // Photo upload
  setupPhotoUpload() {
    const input = document.getElementById('photo-input');
    const preview = document.getElementById('photo-preview');
    const placeholder = document.getElementById('photo-placeholder');

    if (input) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            Toast.error('File Too Large', 'Photo must be less than 5MB.');
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            if (preview) {
              preview.src = e.target.result;
              preview.style.display = 'block';
            }
            if (placeholder) placeholder.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  },

  // Payment plan selection
  setupPaymentPlan() {
    document.querySelectorAll('input[name="payment_plan"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.updatePaymentSummary();
      });
    });
  },

  // Coupon code
  setupCoupon() {
    const verifyBtn = document.getElementById('verify-coupon-btn');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => this.verifyCoupon());
    }
  },

  async verifyCoupon() {
    const codeInput = document.getElementById('coupon-code');
    const code = codeInput?.value.trim();
    if (!code) {
      Toast.warning('Enter Coupon', 'Please enter a coupon code.');
      return;
    }

    const courseSelect = document.getElementById('course-select') || document.querySelector('[name="course_id"]');
    const courseId = courseSelect?.value;
    if (!courseId) return;

    try {
      // Get course price
      const courseRes = await API.get(`/api/courses`);
      const course = courseRes.data?.find(c => c.id == courseId);
      const amount = course?.discounted_price || course?.price || 0;

      const result = await API.post('/api/payments/verify-coupon', { code, amount });

      if (result.success) {
        Toast.success('Coupon Applied!', result.message);
        this.formData.coupon_code = code;
        this.formData.coupon_discount = result.data.discount;
        document.getElementById('coupon-status')?.classList.add('success');
        const statusEl = document.getElementById('coupon-status');
        if (statusEl) statusEl.textContent = result.message;
        this.updatePaymentSummary();
      } else {
        Toast.error('Invalid Coupon', result.message);
        const statusEl = document.getElementById('coupon-status');
        if (statusEl) {
          statusEl.textContent = result.message;
          statusEl.classList.remove('success');
        }
      }
    } catch (error) {
      Toast.error('Error', 'Failed to verify coupon.');
    }
  },

  loadCourseInfo() {
    // Course info is pre-loaded from server side
    // Just update display
  },

  loadPaymentSummary() {
    this.updatePaymentSummary();
  },

  updatePaymentSummary() {
    const plan = document.querySelector('input[name="payment_plan"]:checked')?.value || 'full';
    const priceEl = document.getElementById('course-price');
    if (!priceEl) return;

    const price = parseFloat(priceEl.getAttribute('data-price')) || 0;
    const discount = parseFloat(this.formData.coupon_discount) || 0;
    const priceAfterDiscount = price - discount;
    const gst = Math.round(priceAfterDiscount * 0.18 * 100) / 100;
    const total = priceAfterDiscount;

    let payNow = total;
    let balance = 0;

    if (plan === 'advance') {
      payNow = Math.round(total * 0.5);
      balance = total - payNow;
    }

    // Update display
    const updateEl = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = formatCurrency(value);
    };

    updateEl('summary-subtotal', price);
    updateEl('summary-discount', discount);
    updateEl('summary-gst', gst);
    updateEl('summary-total', total);
    updateEl('summary-pay-now', payNow);
    updateEl('summary-balance', balance);

    const balanceRow = document.getElementById('balance-row');
    if (balanceRow) {
      balanceRow.style.display = plan === 'advance' ? 'flex' : 'none';
    }
  },

  // Submit registration
  async submitForm() {
    this.saveData();

    const form = document.getElementById('registration-form');
    if (!form) return;

    const submitBtn = document.querySelector('[data-wizard-submit]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Processing...';
    }

    try {
      const formData = new FormData(form);
      
      // Add payment plan
      const plan = document.querySelector('input[name="payment_plan"]:checked')?.value || 'full';
      formData.set('payment_plan', plan);

      // Add coupon
      if (this.formData.coupon_code) {
        formData.set('coupon_code', this.formData.coupon_code);
      }

      const result = await API.post('/api/registrations', formData, true);

      if (result.success) {
        // Clear saved data
        localStorage.removeItem('arox-registration');

        // Show success step
        this.showSuccessPage(result.data);
        this.currentStep = 5;
        this.showStep(5);

        // Launch confetti!
        Confetti.launch();

        Toast.success('Registration Successful!', 'Welcome to AROX Tech! 🎉');
      } else {
        Toast.error('Registration Failed', result.message);
      }
    } catch (error) {
      Toast.error('Error', 'Something went wrong. Please try again.');
      console.error('Registration error:', error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💳 Complete Registration';
      }
    }
  },

  showSuccessPage(data) {
    const panel = document.getElementById('wizard-step-5');
    if (!panel) return;

    panel.innerHTML = `
      <div class="success-page">
        <div class="success-checkmark">🎉</div>
        <h2 style="margin-bottom: 8px;">Congratulations!</h2>
        <p style="color: var(--text-secondary); margin-bottom: 32px;">Your registration has been completed successfully.</p>
        
        <div class="success-details">
          <div class="success-detail-row">
            <span class="label">Student ID</span>
            <span class="value">${data.studentId}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Registration ID</span>
            <span class="value">${data.registrationId}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Course</span>
            <span class="value">${data.courseName}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Batch</span>
            <span class="value">${data.batchName || 'TBD'}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Start Date</span>
            <span class="value">${data.startDate || 'TBD'}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Trainer</span>
            <span class="value">${data.trainerName || 'TBD'}</span>
          </div>
          <div class="success-detail-row">
            <span class="label">Amount Paid</span>
            <span class="value" style="color: var(--success);">${formatCurrency(data.paidAmount)}</span>
          </div>
          ${data.balanceAmount > 0 ? `
          <div class="success-detail-row">
            <span class="label">Balance Due</span>
            <span class="value" style="color: var(--warning);">${formatCurrency(data.balanceAmount)}</span>
          </div>
          ` : ''}
        </div>

        <div class="card" style="background: var(--primary-50); border-color: var(--primary-200); margin: 24px 0; text-align: left;">
          <h4 style="color: var(--primary); margin-bottom: 12px;">🔑 Your Login Credentials</h4>
          <p style="margin-bottom: 8px;"><strong>Email:</strong> ${data.credentials.email}</p>
          <p style="margin-bottom: 8px;"><strong>Password:</strong> ${data.credentials.password}</p>
          <p style="font-size: 0.8rem; color: var(--danger); margin-top: 8px;">⚠️ Please save these credentials and change your password after first login.</p>
        </div>

        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
          <a href="${data.offerLetterUrl}" class="btn btn-primary btn-lg" target="_blank">
            📄 Download Offer Letter
          </a>
          <a href="/login" class="btn btn-secondary btn-lg">
            🚀 Go to Student Portal
          </a>
        </div>
      </div>
    `;

    panel.classList.add('active');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const wizardForm = document.getElementById('registration-form');
  if (wizardForm) {
    RegistrationWizard.init();
  }
});
