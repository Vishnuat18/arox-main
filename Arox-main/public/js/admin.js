/**
 * AROX ERP - Admin Dashboard JavaScript
 */

const AdminApp = {
  init() {
    this.setupSidebar();
    this.setupModals();
    this.setupDataTables();
  },

  setupSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    
    if (toggle && sidebar) {
      // Check saved state
      if (localStorage.getItem('admin-sidebar-collapsed') === 'true') {
        sidebar.classList.add('collapsed');
      }

      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('admin-sidebar-collapsed', sidebar.classList.contains('collapsed'));
        
        // Trigger resize for charts
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      });
    }
  },

  setupModals() {
    // Open modals
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('open');
        }
      });
    });

    // Close modals
    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = btn.closest('.modal-overlay');
        if (overlay) {
          overlay.classList.remove('open');
        }
      });
    });

    // Close on click outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });
  },

  setupDataTables() {
    // Simple client-side search for data tables
    document.querySelectorAll('[data-table-search]').forEach(input => {
      input.addEventListener('input', debounce((e) => {
        const targetId = input.getAttribute('data-table-search');
        const table = document.getElementById(targetId);
        if (!table) return;

        const term = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(term) ? '' : 'none';
        });
      }, 300));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
