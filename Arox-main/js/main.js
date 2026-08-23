(function () {
  'use strict';

  /* ── THEME SYSTEM ─────────────────────────────────────────── */
  const THEMES = ['light', 'dark'];
  let currentTheme = localStorage.getItem('arox-theme') || 'dark';
  if (!THEMES.includes(currentTheme)) {
    currentTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t) {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'dark');
    root.classList.add('theme-' + t);
    if (t === 'dark') {
      root.classList.add('dark');
    }
    currentTheme = t;
    localStorage.setItem('arox-theme', t);
    updateThemeUI();
    updateLogos();
  }

  function updateThemeUI() {
    // Sync all switch checkboxes with current theme (checked = light, unchecked = dark)
    document.querySelectorAll('#checkbox, #theme-checkbox, .theme-switch-checkbox').forEach(cb => {
      cb.checked = (currentTheme === 'light');
    });

    const icon = document.getElementById('theme-icon');
    if (icon) {
      if (!icon.querySelector('.eye-open-g')) {
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('stroke-width', '2');
        icon.innerHTML = `
          <g class="eye-open-g">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </g>
          <g class="eye-closed-g">
            <path d="M2 10s3 5 10 5 10-5 10-5"></path>
            <path d="M6 13l-1.5 2.5"></path>
            <path d="M10 15v3"></path>
            <path d="M14 15v3"></path>
            <path d="M18 13l1.5 2.5"></path>
          </g>
        `;
      }
      
      if (currentTheme === 'light') {
        icon.setAttribute('stroke', '#f59e0b');
      } else {
        icon.setAttribute('stroke', '#38bdf8');
      }
    }

    document.querySelectorAll('.mobile-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
  }

  function updateLogos() {
    const isDark = currentTheme === 'dark';
    const src = isDark ? 'public/assets/logo/logo-dark.png' : 'public/assets/logo/logo-light.png';
    ['nav-logo-img', 'footer-logo-img'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.src = src;
    });
  }

  document.addEventListener('change', (e) => {
    if (e.target.id === 'checkbox' || e.target.id === 'theme-checkbox' || e.target.classList.contains('theme-switch-checkbox')) {
      applyTheme(e.target.checked ? 'light' : 'dark');
    }
  });

  const oldBtn = document.getElementById('theme-toggle-btn');
  if (oldBtn) {
    oldBtn.addEventListener('click', () => {
      const idx = THEMES.indexOf(currentTheme);
      applyTheme(THEMES[(idx + 1) % THEMES.length]);
    });
  }
  document.querySelectorAll('.mobile-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });
  applyTheme(currentTheme);

  // Sync theme changes across multiple tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'arox-theme') {
      const newTheme = e.newValue || 'dark';
      if (newTheme !== currentTheme) {
        applyTheme(newTheme);
      }
    }
  });

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ── NAVBAR ─────────────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  let lastScrollY = 0, mobileOpen = false;

  function setHamburgerIcon(open) {
    if (!hamburgerIcon) return;
    hamburgerIcon.innerHTML = open
      ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
      : '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
  }
  setHamburgerIcon(false);

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileOpen = !mobileOpen;
      mobileMenu.classList.toggle('open', mobileOpen);
      mobileMenu.setAttribute('aria-hidden', String(!mobileOpen));
      document.body.classList.toggle('no-scroll', mobileOpen);
      setHamburgerIcon(mobileOpen);
    });

    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta-btn, .mobile-login-btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileOpen = false;
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        setHamburgerIcon(false);
      });
    });
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      if (window.isHScrollActive || window.isServicesScrollActive) {
        header.classList.add('hidden-nav');
      } else {
        if (y > lastScrollY && y > 100) header.classList.add('hidden-nav');
        else header.classList.remove('hidden-nav');
      }
    }
    lastScrollY = y;
  }, { passive: true });

  /* ── NAVBAR SLIDING HOVER PILL ───────────────────────────── */
  function initNavHoverPill() {
    const navLinksList = document.querySelectorAll('.nav-links');
    navLinksList.forEach(nav => {
      let pill = nav.querySelector('.nav-sliding-pill');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'nav-sliding-pill';
        nav.insertBefore(pill, nav.firstChild);
      }

      const links = Array.from(nav.querySelectorAll('.nav-link'));
      if (!links.length) return;

      function updatePill(targetEl, immediate) {
        if (!targetEl) {
          pill.style.opacity = '0';
          return;
        }
        const navRect = nav.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const left = targetRect.left - navRect.left;
        const top = targetRect.top - navRect.top;
        const width = targetRect.width;
        const height = targetRect.height;

        if (immediate) {
          pill.style.transition = 'none';
        } else {
          pill.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        }

        pill.style.transform = `translate(${left}px, ${top}px)`;
        pill.style.width = `${width}px`;
        pill.style.height = `${height}px`;
        pill.style.opacity = '1';

        if (immediate) {
          requestAnimationFrame(() => {
            pill.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
          });
        }
      }

      const activeLink = nav.querySelector('.nav-link.active') || links[0];
      
      // Position on active link on load
      requestAnimationFrame(() => {
        updatePill(activeLink, true);
      });

      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          updatePill(link, false);
        });
      });

      nav.addEventListener('mouseleave', () => {
        const currentActive = nav.querySelector('.nav-link.active');
        if (currentActive) {
          updatePill(currentActive, false);
        } else {
          pill.style.opacity = '0';
        }
      });

      window.addEventListener('resize', () => {
        const currentHovered = nav.querySelector('.nav-link:hover');
        const currentActive = nav.querySelector('.nav-link.active');
        updatePill(currentHovered || currentActive, true);
      }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavHoverPill);
  } else {
    initNavHoverPill();
  }

  /* ── HERO SECTION ENTRANCE & PARALLAX ────────────────────────── */
  const heroSection = document.getElementById('hero');
  if (heroSection && typeof gsap !== 'undefined') {
    const heroElements = heroSection.querySelectorAll('span.text-xs, h1, p, .flex.gap-4, .btn-primary, .btn-secondary, .scroll-indicator');
    if (heroElements.length) {
      gsap.fromTo(heroElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1
        }
      );
    }

    const gridBg = heroSection.querySelector('.grid-lines-bg');
    if (gridBg && window.innerWidth > 768) {
      heroSection.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 18;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 18;
        gsap.to(gridBg, { x: xPos, y: yPos, duration: 0.6, ease: 'power1.out' });
      });
    }
  }

  /* ── MAGNETIC BUTTONS ─────────────────────────────────────────── */
  function initMagnetic(btn) {
    let animX = 0, animY = 0, targetX = 0, targetY = 0, rafId = null;
    function tick() {
      animX += (targetX - animX) * 0.25;
      animY += (targetY - animY) * 0.25;
      btn.style.transform = `translate(${animX.toFixed(2)}px,${animY.toFixed(2)}px)`;
      if (Math.abs(targetX - animX) > 0.05 || Math.abs(targetY - animY) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else { rafId = null; }
    }
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      targetX = (e.clientX - r.left - r.width / 2) * 0.25;
      targetY = (e.clientY - r.top - r.height / 2) * 0.25;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
    btn.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
  }
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(initMagnetic);

  /* ── GSAP STATS ─────────────────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const statCards = Array.from(document.querySelectorAll('.stat-card-gsap'));
  const N_STATS = statCards.length;
  const TOTAL_SCROLL_STATS = N_STATS * 300;

  function revealStat(card, p) {
    p = Math.max(0, Math.min(1, p));
    card.style.clipPath = `inset(${((1 - p) * 100).toFixed(4)}% 0 0% 0 round 22px)`;
    if (typeof gsap !== 'undefined') {
      gsap.set(card, { opacity: p, y: (1 - p) * 110, scale: 0.94 + p * 0.06, force3D: true });
    }
    const sweep = card.querySelector('.light-sweep');
    if (sweep) sweep.style.left = `${p * 200 - 100}%`;
    const numEl = card.querySelector('.card-number');
    if (numEl) {
      const target = parseFloat(numEl.dataset.target || '0');
      const suffix = numEl.dataset.suffix || '';
      if (p >= 0.99) {
        if (!card._counting && card._val !== target) {
          card._counting = true;
          if (card._val === undefined) card._val = 0;
          if (typeof gsap !== 'undefined') {
            gsap.to(card, {
              _val: target, duration: 1.2, ease: 'power3.out',
              onUpdate() { numEl.textContent = Math.round(card._val) + suffix; },
              onComplete() { card._counting = false; }
            });
          } else {
            numEl.textContent = target + suffix;
            card._counting = false;
          }
        }
      } else {
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(card, '_val');
        }
        card._counting = false; card._val = 0;
        numEl.textContent = '0' + suffix;
      }
    }
  }

  if (N_STATS > 0 && document.getElementById('stats-section')) {
    statCards.forEach(c => revealStat(c, 0));
    ScrollTrigger.create({
      trigger: document.getElementById('stats-section'),
      pin: true, start: 'top top', end: `+=${TOTAL_SCROLL_STATS}`,
      scrub: 1, anticipatePin: 1,
      onUpdate(self) {
        statCards.forEach((card, i) => {
          const sliceStart = i / N_STATS;
          revealStat(card, (self.progress - sliceStart) / (1 / N_STATS));
        });
      }
    });
  }

  /* ── GSAP WHY CHOOSE US ─────────────────────────────────────── */
  const wcuList = document.getElementById('wcu-list');
  if (wcuList) {
    const wcuScene = document.getElementById('wcu-scene');
    const wcuSticky = document.getElementById('wcu-sticky');
    const wcuLabel = document.getElementById('wcu-label');
    const wcuListW = document.getElementById('wcu-list-wrap');
    const wcuItems = Array.from(wcuList.querySelectorAll('.wcu-item'));
    const N_ITEMS = wcuItems.length;
    let itemH = 0;

    function setupWCU() {
      if (wcuLabel && wcuListW) {
        const lr = wcuLabel.getBoundingClientRect().right;
        wcuListW.style.left = (lr + 18) + 'px';
      }
      if (wcuItems[0]) {
        itemH = wcuItems[0].offsetHeight;
        wcuList.style.top = (window.innerHeight / 2 - itemH / 2) + 'px';
      }
    }

    function renderWCU(frac) {
      frac = Math.max(0, Math.min(N_ITEMS - 1, frac));
      const active = Math.round(frac);
      gsap.set(wcuList, { y: -frac * itemH });
      wcuItems.forEach((el, i) => {
        const d = i - active;
        if (d === 0) { el.style.opacity = '1'; el.style.filter = 'none'; }
        else if (d < 0) { el.style.opacity = String(Math.max(0, 0.22 + d * 0.07)); el.style.filter = 'none'; }
        else { el.style.opacity = String(Math.max(0.04, 0.48 - (d - 1) * 0.09)); el.style.filter = d > 1 ? `blur(${(d - 1) * 1.8}px)` : 'none'; }
      });
    }

    setupWCU(); renderWCU(0);
    ScrollTrigger.create({
      trigger: wcuScene, start: 'top top', end: `+=${(N_ITEMS - 1) * 250}`,
      pin: wcuSticky, scrub: 0.5,
      onUpdate(self) { renderWCU(self.progress * (N_ITEMS - 1)); }
    });
    window.addEventListener('resize', () => { setupWCU(); ScrollTrigger.refresh(); }, { passive: true });
  }

  /* ── MAGIC BENTO ─────────────────────────────────────────────── */
  const bentoGrid = document.getElementById('bento-grid');
  if (bentoGrid) {
    const bentoData = [
      { title: 'Web Development', desc: 'Bespoke enterprise websites and highly scalable cloud platforms.', label: 'TOP SERVICE' },
      { title: 'App Development', desc: 'Premium cross-platform native iOS & Android applications.', label: 'MOBILE SOLUTIONS' },
      { title: 'Software Development', desc: 'Secure desktop suites, API backends, and customized ERP integrations.', label: 'ENTERPRISE SYSTEM' },
      { title: 'Digital Marketing', desc: 'Data-driven growth strategies and SEO.', label: 'GROWTH' },
      { title: 'BPO Services', desc: 'Efficient outsourced business processes and support.', label: 'OPERATIONS' },
      { title: 'Branding & Designing', desc: 'Crafting unforgettable identities and premium UX/UI experiences.', label: 'CREATIVE' },
      { title: 'Industry Training', desc: 'Corporate skill development and specialized tech workshops.', label: 'EDUCATION' },
      { title: 'Internships', desc: 'Hands-on experience building real-world enterprise applications.', label: 'CAREER' }
    ];
    const arrowSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    bentoData.forEach((card, idx) => {
      const el = document.createElement('div');
      const isEven = idx % 2 === 0;
      el.className = `magic-bento-card magic-bento-card--border-glow particle-container ${isEven ? 'bento-primary' : 'bento-secondary'}`;
      el.innerHTML = `<div class="magic-blob-1"></div><div class="magic-blob-2"></div>
        <div class="magic-bento-card__header"><div class="magic-bento-card__label">${card.label}</div></div>
        <div class="magic-bento-card__content"><h2 class="magic-bento-card__title">${card.title}</h2></div>
        <div class="magic-bento-card__footer"><p class="magic-bento-card__description">${card.desc}</p><span class="magic-bento-card__arrow">${arrowSVG}</span></div>`;
      bentoGrid.appendChild(el);

      if (window.innerWidth > 768) {
        let hovered = false, particles = [], timeouts = [];

        function clearParticles() {
          timeouts.forEach(clearTimeout); timeouts = [];
          particles.forEach(p => gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete() { p.parentNode && p.parentNode.removeChild(p); } }));
          particles = [];
        }
        function spawnParticles() {
          if (!hovered) return;
          const { width, height } = el.getBoundingClientRect();
          
          // Dynamic theme-aware particle colors (white in dark theme, dark gray in light theme)
          const isDark = document.documentElement.classList.contains('theme-dark') || document.documentElement.classList.contains('theme-navy');
          const pColor = isDark ? '255,255,255' : '95,99,104';
          
          for (let i = 0; i < 12; i++) {
            const to = setTimeout(() => {
              if (!hovered) return;
              const p = document.createElement('div');
              p.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${pColor},1);box-shadow:0 0 6px rgba(${pColor},.6);pointer-events:none;z-index:100;left:${Math.random()*width}px;top:${Math.random()*height}px;`;
              el.appendChild(p); particles.push(p);
              gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
              gsap.to(p, { x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
              gsap.to(p, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
            }, i * 100);
            timeouts.push(to);
          }
        }

        el.addEventListener('mouseenter', () => { hovered = true; spawnParticles(); gsap.to(el, { rotateX: 5, rotateY: -5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 }); });
        el.addEventListener('mouseleave', () => { hovered = false; clearParticles(); gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); el.style.setProperty('--glow-intensity', '0'); });
        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left, y = e.clientY - r.top;
          const cx = r.width / 2, cy = r.height / 2;
          gsap.to(el, { rotateX: ((y - cy) / cy) * -10, rotateY: ((x - cx) / cx) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
          gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: 'power2.out' });
          el.style.setProperty('--glow-x', ((x / r.width) * 100) + '%');
          el.style.setProperty('--glow-y', ((y / r.height) * 100) + '%');
          el.style.setProperty('--glow-intensity', '1');
          el.style.setProperty('--glow-radius', '200px');
        });
        el.addEventListener('click', e => {
          const r = el.getBoundingClientRect();
          const cx = e.clientX - r.left, cy = e.clientY - r.top;
          const maxD = Math.max(Math.hypot(cx, cy), Math.hypot(cx - r.width, cy), Math.hypot(cx, cy - r.height), Math.hypot(cx - r.width, cy - r.height));
          
          // Dynamic theme-aware ripple color
          const isDark = document.documentElement.classList.contains('theme-dark') || document.documentElement.classList.contains('theme-navy');
          const rColor = isDark ? '255,255,255' : '0,0,0';
          
          const ripple = document.createElement('div');
          ripple.style.cssText = `position:absolute;width:${maxD*2}px;height:${maxD*2}px;border-radius:50%;background:radial-gradient(circle,rgba(${rColor},.3) 0%,rgba(${rColor},.1) 30%,transparent 70%);left:${cx-maxD}px;top:${cy-maxD}px;pointer-events:none;z-index:1000;`;
          el.appendChild(ripple);
          gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete() { ripple.remove(); } });
        });
      }
    });

    // Bento global spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    document.body.appendChild(spotlight);
    document.addEventListener('mousemove', e => {
      const rect = bentoGrid.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) { gsap.to(spotlight, { opacity: 0, duration: 0.3 }); return; }
      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1 });
      let minD = Infinity;
      bentoGrid.querySelectorAll('.magic-bento-card').forEach(c => {
        const cr = c.getBoundingClientRect();
        minD = Math.min(minD, Math.max(0, Math.hypot(e.clientX - (cr.left + cr.width / 2), e.clientY - (cr.top + cr.height / 2)) - Math.max(cr.width, cr.height) / 2));
      });
      const prox = 150, fade = 225;
      const op = minD <= prox ? 0.8 : minD <= fade ? ((fade - minD) / (fade - prox)) * 0.8 : 0;
      gsap.to(spotlight, { opacity: op, duration: op > 0 ? 0.2 : 0.5 });
    });
  }

  /* ── PROJECTS ─────────────────────────────────────────────────── */
  const projectsData = [
    { title: 'Apex Finance Ledger', cat: 'FINTECH • ENTERPRISE', desc: 'Next-gen banking infrastructure streaming transactions for 10M+ accounts globally.', accent: 'linear-gradient(to top right,rgba(249,115,22,.2),rgba(245,158,11,.2))', idx: 1 },
    { title: 'Helix Supply Chain', cat: 'LOGISTICS • AI ENGINE', desc: 'Automated warehouse logistics routing utilizing semantic model prediction layers.', accent: 'linear-gradient(to top right,rgba(59,130,246,.2),rgba(14,165,233,.2))', idx: 2 },
    { title: 'Nova Telecom Portal', cat: 'TELECOM • CLOUD CORE', desc: 'High-performance web dashboard handling multi-tenant subscriber data securely.', accent: 'linear-gradient(to top right,rgba(168,85,247,.2),rgba(236,72,153,.2))', idx: 3 }
  ];
  const pg = document.getElementById('projects-grid');
  if (pg) {
    projectsData.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.position = 'relative';
      card.innerHTML = `<div class="project-preview"><div class="project-preview-gradient" style="background:${proj.accent}"></div><div class="project-grid-overlay"></div><span class="project-case-label">CASE ${proj.idx}</span></div><div><span class="project-category">${proj.cat}</span><h3 class="project-title">${proj.title}</h3><p class="project-desc">${proj.desc}</p></div>`;
      let glowEl = null;
      card.addEventListener('mouseenter', () => { glowEl = document.createElement('div'); glowEl.className = 'spotlight-glow'; card.appendChild(glowEl); });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if (glowEl) { glowEl.style.left = x + 'px'; glowEl.style.top = y + 'px'; }
        gsap.to(card, { rotateX: ((y - r.height / 2) / (r.height / 2)) * -6, rotateY: ((x - r.width / 2) / (r.width / 2)) * 6, scale: 1.015, duration: 0.1, ease: 'power2.out', transformPerspective: 1000, transformStyle: 'preserve-3d' });
      });
      card.addEventListener('mouseleave', () => { if (glowEl) { glowEl.remove(); glowEl = null; } gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.3 }); });
      pg.appendChild(card);
    });
  }

  /* ── TESTIMONIALS ─────────────────────────────────────────────── */
  const testimonials = [
    { 
      quote: 'Premium is an understatement. The code clarity, testing metrics, and UI design are world-class.', 
      highlightedQuote: '<span class="quote-highlight">Premium</span> is an understatement. <br/>The code clarity, testing metrics, and UI design are <span class="quote-accent">world-class.</span>',
      author: 'Sora Takahashi', 
      role: 'Lead Architect, Nova Portal', 
      project: 'NOVA PORTAL',
      projectCat: 'Enterprise Solutions',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80' 
    },
    { 
      quote: 'AROX rebuilt our entire payment system in record time. System outages dropped to zero.', 
      highlightedQuote: '<span class="quote-highlight">AROX rebuilt</span> our entire payment system in record time. <br/>System outages dropped to <span class="quote-accent">zero.</span>',
      author: 'Elena Rostova', 
      role: 'VP of Engineering, Apex Ledger', 
      project: 'APEX LEDGER',
      projectCat: 'Fintech Solutions',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80' 
    },
    { 
      quote: 'Their training program is unmatched. The engineering standards they changed our team culture.', 
      highlightedQuote: 'Their training program is <span class="quote-highlight">unmatched</span>. <br/>The engineering standards they changed our <span class="quote-accent">team culture.</span>',
      author: 'Marcus Vance', 
      role: 'Director of Talent, Helix Logistics', 
      project: 'HELIX LOGISTICS',
      projectCat: 'Logistics Engine',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' 
    }
  ];
  const contentArea = document.getElementById('testimonial-content-area');
  let activeIdx = 0;

  if (contentArea) {
    testimonials.forEach((t, i) => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `
        <p class="testimonial-quote">"${t.highlightedQuote || t.quote}"</p>
        <div class="testimonial-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
        </div>
        <div class="testimonial-meta-row">
          <div class="meta-left">
            <div class="testimonial-name">${t.author}</div>
            <div class="testimonial-role">${t.role}</div>
          </div>
          <div class="meta-right">
            <div class="verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 11 11 13 15 9"/>
              </svg>
              <span>VERIFIED CLIENT</span>
            </div>
          </div>
        </div>
      `;
      contentArea.appendChild(slide);
    });
  }

  function switchTestimonial(idx) {
    if (!contentArea) return;
    const slides = contentArea.querySelectorAll('.testimonial-slide');
    if (!slides || !slides[activeIdx]) return;
    slides[activeIdx].classList.remove('active');
    slides[activeIdx].classList.add('exit');
    const prev = activeIdx;
    setTimeout(() => { if (slides[prev]) slides[prev].classList.remove('exit'); }, 400);
    activeIdx = idx;
    if (slides[idx]) slides[idx].classList.add('active');
  }

  // Swipe card stack
  const cardStack = document.getElementById('card-stack');
  const stackDotsContainer = document.getElementById('stack-dots');
  let cards = testimonials.map((_, i) => ({ id: i, origIdx: i }));

  function getStyle(index) {
    const n = cards.length;
    return {
      zIndex: n - index,
      scale: 1 - index * 0.05,
      x: n > 1 ? (index / (n - 1)) * 60 : 0,
      y: -(index * 12),
      rotate: n > 1 ? (index / (n - 1)) * -15 : 0,
      opacity: 1 - index * 0.15
    };
  }

  function updateDots(activeOrigIdx) {
    if (!stackDotsContainer) return;
    stackDotsContainer.innerHTML = '';
    testimonials.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = i === activeOrigIdx ? 'stack-dot stack-dot-active' : 'stack-dot';
      stackDotsContainer.appendChild(dot);
    });
  }

  function buildStack() {
    if (!cardStack) return;
    cardStack.innerHTML = '';
    cards.forEach((card, index) => {
      const isTop = index === 0;
      const t = testimonials[card.origIdx];
      const s = getStyle(index);
      const div = document.createElement('div');
      div.className = 'stack-card' + (isTop ? ' is-top' : '') + ` stack-depth-${index}`;
      div.style.cssText = `z-index:${s.zIndex};transform:translate(${s.x}px,${s.y}px) rotate(${s.rotate}deg) scale(${s.scale});opacity:${s.opacity};`;
      
      if (isTop) {
        div.innerHTML = `
          <img src="${t.image}" alt="${t.author}" loading="lazy"/>
          <div class="stack-card-overlay">
            <div class="client-badge">
              <div class="badge-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="10" width="20" height="12" rx="2" ry="2"></rect>
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"></path>
                </svg>
              </div>
              <div class="badge-text-group">
                <div class="badge-title">${t.project}</div>
                <div class="badge-subtitle">${t.projectCat}</div>
              </div>
            </div>
          </div>`;
        setupDrag(div);
      } else {
        div.innerHTML = `<img src="${t.image}" alt="${t.author}" loading="lazy"/><div class="stack-card-overlay"></div>`;
      }
      cardStack.appendChild(div);
    });
    switchTestimonial(cards[0].origIdx);
    updateDots(cards[0].origIdx);
  }

  function pushToBack() {
    const [first, ...rest] = cards;
    cards = [...rest, first];
    buildStack();
  }

  let isDragging = false;
  let autoSwipeInterval;

  function autoSwipe() {
    if (!cardStack) return;
    const topCard = cardStack.querySelector('.is-top');
    if (!topCard || isDragging) return;
    gsap.to(topCard, {
      x: -150, 
      y: 50, 
      rotate: -15, 
      opacity: 0,
      duration: 0.4, 
      onComplete: () => {
        pushToBack();
      }
    });
  }

  function setupDrag(topCard) {
    let startX = 0, startY = 0, dx = 0, dy = 0;
    const s = getStyle(0);

    function onDown(cx, cy) {
      isDragging = true; 
      startX = cx; 
      startY = cy; 
      dx = 0; 
      dy = 0; 
      topCard.style.transition = 'none'; 
      clearInterval(autoSwipeInterval); 
    }
    
    function onMove(cx, cy) {
      if (!isDragging) return;
      dx = cx - startX; dy = cy - startY;
      topCard.style.transform = `translate(${s.x + dx}px,${s.y + dy}px) rotate(${s.rotate + dx * 0.05}deg) scale(1.05)`;
    }
    
    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      topCard.style.transition = '';
      if (Math.hypot(dx, dy) > 50) { 
        pushToBack(); 
      }
      else { 
        gsap.to(topCard, { x: s.x, y: s.y, rotate: s.rotate, scale: s.scale, duration: 0.4, ease: 'back.out(1)' }); 
      }
      autoSwipeInterval = setInterval(autoSwipe, 3800); 
    }

    topCard.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => { if (isDragging) onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onUp);
    topCard.addEventListener('touchstart', e => { const t = e.touches[0]; onDown(t.clientX, t.clientY); }, { passive: true });
    window.addEventListener('touchmove', e => { if (isDragging) { const t = e.touches[0]; onMove(t.clientX, t.clientY); } }, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  // Bind arrows controls
  const btnPrev = document.getElementById('stack-prev');
  const btnNext = document.getElementById('stack-next');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      clearInterval(autoSwipeInterval);
      const last = cards[cards.length - 1];
      cards = [last, ...cards.slice(0, -1)];
      buildStack();
      autoSwipeInterval = setInterval(autoSwipe, 3800);
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      clearInterval(autoSwipeInterval);
      pushToBack();
      autoSwipeInterval = setInterval(autoSwipe, 3800);
    });
  }

  if (cardStack) {
    buildStack();
    autoSwipeInterval = setInterval(autoSwipe, 3800);
  }


  /* ── PAGE TRANSITION SLIDE CURTAIN ── */
  const curtain = document.createElement('div');
  curtain.className = 'page-transition-curtain';
  curtain.style.transform = 'translateY(0)'; // start at top to mask initial load
  curtain.style.pointerEvents = 'all';
  document.body.appendChild(curtain);

  // Trigger curtain slide-out to reveal page content once ready
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      curtain.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        curtain.style.pointerEvents = 'none';
      }, 550);
    });
  });

  // Intercept local page routing for curtain slide-in effect
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.getAttribute('href') !== '#' && !link.getAttribute('href').startsWith('javascript:') && link.target !== '_blank') {
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) {
        e.preventDefault();
        // Position curtain at bottom, then slide up to cover screen
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(100%)';
        curtain.style.pointerEvents = 'all';
        
        requestAnimationFrame(() => {
          curtain.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
          curtain.style.transform = 'translateY(0)';
          setTimeout(() => {
            window.location.href = link.href;
          }, 420);
        });
      }
    }
  });

  /* ── LENIS SMOOTH INERTIA SCROLLING ── */
  function initLenis() {
    if (window.lenis) return;
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  if (typeof Lenis !== 'undefined') {
    initLenis();
  } else {
    // Only load Lenis on desktop for performance (skip on mobile/touch devices)
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (!isMobile) {
      const lenisScript = document.createElement('script');
      lenisScript.src = "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js";
      lenisScript.defer = true;
      lenisScript.onload = initLenis;
      document.head.appendChild(lenisScript);
    }
  }

  /* ── SCROLL REVEAL ANIMATIONS ─────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const revealTargets = document.querySelectorAll('.services-header, .projects-header, .testimonials-header, .cta-card, .cta-section');
    revealTargets.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ── FOOTER RESPONSIVE ACCORDION / WEBVIEW SHOW-ALL ──────────── */
  function initFooterResponsive() {
    const footerCols = document.querySelectorAll('footer details.footer-col');
    if (!footerCols.length) return;

    function ensureDesktopExpanded() {
      if (window.innerWidth > 768) {
        // Desktop / webview: expand ALL columns
        footerCols.forEach(col => col.setAttribute('open', ''));
      }
    }

    // Ensure desktop view has all columns expanded
    ensureDesktopExpanded();

    // On resize to desktop, make sure all columns are open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        ensureDesktopExpanded();
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterResponsive);
  } else {
    initFooterResponsive();
  }
})();
