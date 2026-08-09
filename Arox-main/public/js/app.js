/**
 * AROX ERP - Core Application JavaScript
 * Theme toggle, toasts, navbar, animations, utilities
 */

// ==========================================
// Theme Toggle (Dark/Light Mode)
// ==========================================
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('arox-theme') || 'light';
    this.setTheme(saved);
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        this.setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('arox-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }
};

// ==========================================
// Toast Notification System
// ==========================================
const Toast = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(type, title, message, duration = 4000) {
    if (!this.container) this.init();

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
    `;

    this.container.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  },

  success(title, message) { return this.show('success', title, message); },
  error(title, message) { return this.show('error', title, message); },
  warning(title, message) { return this.show('warning', title, message); },
  info(title, message) { return this.show('info', title, message); }
};

// ==========================================
// Navbar
// ==========================================
const Navbar = {
  init() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    const overlay = document.querySelector('.mobile-overlay');

    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Initial check
    if (window.scrollY > 50) navbar.classList.add('scrolled');

    // Mobile menu
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          menu.classList.remove('open');
          overlay.classList.remove('open');
        });
      }
    }
  }
};

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
const ScrollAnimations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }
};

// ==========================================
// Number Counter Animation
// ==========================================
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = Date.now();

    const update = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      }
    };

    requestAnimationFrame(update);
  }
};

// ==========================================
// Accordion
// ==========================================
const Accordion = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('open');

        // Close all siblings (optional — remove for multi-open)
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('open');
              openItem.querySelector('.accordion-content').style.maxHeight = '0';
            }
          });
        }

        if (isOpen) {
          item.classList.remove('open');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }
};

// ==========================================
// Ripple Effect
// ==========================================
const RippleEffect = {
  init() {
    document.querySelectorAll('.btn, .navbar-cta').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
};

// ==========================================
// Back to Top
// ==========================================
const BackToTop = {
  init() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ==========================================
// Smooth scroll for anchor links
// ==========================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

// ==========================================
// Tabs
// ==========================================
const Tabs = {
  init() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
      const buttons = tabContainer.querySelectorAll('.tab-btn');
      const parent = tabContainer.closest('.tabs-wrapper') || tabContainer.parentElement;
      const contents = parent.querySelectorAll('.tab-content');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-tab');
          
          buttons.forEach(b => b.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          
          btn.classList.add('active');
          const targetEl = document.getElementById(target);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    });
  }
};

// ==========================================
// API Helper
// ==========================================
const API = {
  async get(url) {
    const res = await fetch(url);
    return res.json();
  },

  async post(url, data, isFormData = false) {
    const options = {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    };
    const res = await fetch(url, options);
    return res.json();
  }
};

// ==========================================
// Confetti
// ==========================================
const Confetti = {
  launch() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#4F46E5', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = 2 + Math.random() * 2 + 's';
      piece.style.width = 6 + Math.random() * 8 + 'px';
      piece.style.height = 6 + Math.random() * 8 + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 5000);
  }
};

// ==========================================
// Debounce
// ==========================================
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ==========================================
// Format currency
// ==========================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Toast.init();
  Navbar.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  Accordion.init();
  RippleEffect.init();
  BackToTop.init();
  SmoothScroll.init();
  Tabs.init();
});

// Make Toast globally available
window.Toast = Toast;
window.API = API;
window.Confetti = Confetti;
window.debounce = debounce;
window.formatCurrency = formatCurrency;
