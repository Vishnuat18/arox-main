(function () {
  'use strict';

  // Carousel config settings
  const MOVE_DURATION = 700; // ms
  const EASE = 'cubic-bezier(0.25, 0.8, 0.25, 1)';
  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

  const projects = [
    {
      id: "aether-erp",
      name: "Aether ERP",
      desc: "Next-generation resource planning platform for enterprise manufacturing and warehouse logic.",
      tech: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
      mockupType: "laptop"
    },
    {
      id: "nova-ai",
      name: "Nova AI",
      desc: "Collaborative predictive modeling workspace for data science and machine learning research teams.",
      tech: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "GSAP"],
      mockupType: "tablet"
    },
    {
      id: "helios-cloud",
      name: "Helios Cloud",
      desc: "Distributed serverless monitoring, alert systems, and performance tracing dashboard.",
      tech: ["Next.js", "Node.js", "Express", "TailwindCSS", "TypeScript"],
      mockupType: "mobile"
    },
    {
      id: "vesper-chat",
      name: "Vesper Chat",
      desc: "Encrypted real-time messaging pipeline and collaboration space for secure team communication.",
      tech: ["React", "Node.js", "MongoDB", "Firebase", "TypeScript"],
      mockupType: "laptop"
    },
    {
      id: "apex-iot",
      name: "Apex IoT",
      desc: "Edge device telemetry, cloud ingestion pipelines, and interactive sensor visualization dashboard.",
      tech: ["Next.js", "TailwindCSS", "TypeScript", "GSAP", "Shadcn UI"],
      mockupType: "tablet"
    }
  ];

  const n = projects.length;
  let active = 0;
  let isLocked = false;
  let autoPlayTimer = null;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Generate theme-responsive vector mockups
  function getMockupSVG(type) {
    const cardBg = 'var(--cf-card-bg)';
    const screenBg = 'var(--cf-bg)';
    const strokeColor = 'var(--cf-chip-border)';
    const textMuted = 'var(--cf-dot-bg)';
    const textDark = 'var(--cf-chip-text)';
    
    if (type === 'laptop') {
      return `
        <svg class="device-float" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <!-- Laptop screen frame -->
          <rect x="100" y="40" width="600" height="380" rx="16" fill="${cardBg}" stroke="${textDark}" stroke-width="4"/>
          <rect x="106" y="46" width="588" height="368" rx="10" fill="${screenBg}"/>
          
          <!-- Screen Content: Mock Dashboard -->
          <!-- Sidebar -->
          <rect x="120" y="60" width="120" height="340" rx="6" fill="${cardBg}"/>
          <circle cx="140" cy="80" r="8" fill="${textMuted}"/>
          <rect x="156" y="76" width="60" height="8" rx="4" fill="${textMuted}"/>
          <rect x="130" y="110" width="100" height="2" fill="${strokeColor}"/>
          
          <rect x="130" y="130" width="80" height="8" rx="4" fill="${textMuted}"/>
          <rect x="130" y="150" width="90" height="8" rx="4" fill="${textMuted}"/>
          <rect x="130" y="170" width="70" height="8" rx="4" fill="${textMuted}"/>
          
          <!-- Main Area Header -->
          <rect x="260" y="60" width="414" height="40" rx="8" fill="${cardBg}"/>
          <rect x="280" y="72" width="120" height="12" rx="6" fill="${textDark}"/>
          <rect x="610" y="72" width="40" height="16" rx="8" fill="${textMuted}"/>
          
          <!-- Stats Widgets -->
          <rect x="260" y="120" width="128" height="80" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="280" y="136" width="60" height="8" rx="4" fill="${textMuted}"/>
          <rect x="280" y="156" width="40" height="16" rx="4" fill="${textDark}"/>
          
          <rect x="403" y="120" width="128" height="80" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="423" y="136" width="60" height="8" rx="4" fill="${textMuted}"/>
          <rect x="423" y="156" width="50" height="16" rx="4" fill="${textDark}"/>

          <rect x="546" y="120" width="128" height="80" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="566" y="136" width="60" height="8" rx="4" fill="${textMuted}"/>
          <rect x="566" y="156" width="30" height="16" rx="4" fill="${textDark}"/>

          <!-- Chart widget -->
          <rect x="260" y="220" width="414" height="160" rx="10" fill="${cardBg}" stroke="${strokeColor}"/>
          <path d="M 280 340 L 330 300 L 380 320 L 430 260 L 480 290 L 530 240 L 580 270 L 630 230" fill="none" stroke="${textDark}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- Laptop keyboard base -->
          <path d="M60 420 L740 420 L760 435 L40 435 Z" fill="${cardBg}" stroke="${textDark}" stroke-width="2"/>
          <rect x="350" y="422" width="100" height="6" rx="3" fill="${textMuted}"/>
        </svg>
      `;
    }
    
    if (type === 'tablet') {
      return `
        <svg class="device-float" viewBox="0 0 600 650" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <!-- Tablet Frame -->
          <rect x="120" y="50" width="360" height="500" rx="28" fill="${cardBg}" stroke="${textDark}" stroke-width="4"/>
          <rect x="128" y="58" width="344" height="484" rx="20" fill="${screenBg}"/>
          
          <!-- Screen Content: Analytics and Lists -->
          <circle cx="300" cy="74" r="4" fill="${textMuted}"/>
          
          <!-- Card 1 -->
          <rect x="148" y="100" width="304" height="120" rx="12" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="168" y="120" width="120" height="10" rx="5" fill="${textDark}"/>
          <rect x="168" y="140" width="80" height="8" rx="4" fill="${textMuted}"/>
          <rect x="168" y="170" width="264" height="6" rx="3" fill="${strokeColor}"/>
          <rect x="168" y="170" width="180" height="6" rx="3" fill="${textDark}"/>
          
          <!-- Grid Items -->
          <rect x="148" y="240" width="144" height="130" rx="12" fill="${cardBg}" stroke="${strokeColor}"/>
          <circle cx="220" cy="290" r="28" fill="none" stroke="${strokeColor}" stroke-width="6"/>
          <circle cx="220" cy="290" r="28" fill="none" stroke="${textDark}" stroke-width="6" stroke-dasharray="100 80"/>
          <rect x="180" y="340" width="80" height="8" rx="4" fill="${textMuted}"/>

          <rect x="308" y="240" width="144" height="130" rx="12" fill="${cardBg}" stroke="${strokeColor}"/>
          <path d="M 330 320 L 360 290 L 390 310 L 420 270" fill="none" stroke="${textDark}" stroke-width="3" stroke-linecap="round"/>
          <rect x="340" y="340" width="80" height="8" rx="4" fill="${textMuted}"/>
          
          <!-- Row List -->
          <rect x="148" y="390" width="304" height="120" rx="12" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="168" y="410" width="40" height="24" rx="4" fill="${textMuted}"/>
          <rect x="220" y="414" width="120" height="10" rx="5" fill="${textDark}"/>
          <rect x="220" y="430" width="60" height="6" rx="3" fill="${textMuted}"/>

          <rect x="168" y="454" width="40" height="24" rx="4" fill="${textMuted}"/>
          <rect x="220" y="458" width="140" height="10" rx="5" fill="${textDark}"/>
          <rect x="220" y="474" width="70" height="6" rx="3" fill="${textMuted}"/>
        </svg>
      `;
    }
    
    if (type === 'mobile') {
      return `
        <svg class="device-float" viewBox="0 0 500 650" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <!-- Phone Frame -->
          <rect x="150" y="40" width="200" height="420" rx="24" fill="${cardBg}" stroke="${textDark}" stroke-width="4"/>
          <rect x="156" y="46" width="188" height="408" rx="18" fill="${screenBg}"/>
          
          <!-- Camera Notch -->
          <rect x="210" y="46" width="80" height="15" rx="7" fill="${cardBg}"/>
          
          <!-- Mobile Content -->
          <rect x="168" y="80" width="164" height="80" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <circle cx="250" cy="110" r="16" fill="${textMuted}"/>
          <rect x="200" y="140" width="100" height="8" rx="4" fill="${textDark}"/>
          
          <!-- List feeds -->
          <rect x="168" y="180" width="164" height="50" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="180" y="192" width="120" height="8" rx="4" fill="${textMuted}"/>
          <rect x="180" y="208" width="80" height="6" rx="3" fill="${strokeColor}"/>

          <rect x="168" y="240" width="164" height="50" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="180" y="252" width="110" height="8" rx="4" fill="${textMuted}"/>
          <rect x="180" y="268" width="70" height="6" rx="3" fill="${strokeColor}"/>

          <rect x="168" y="300" width="164" height="50" rx="8" fill="${cardBg}" stroke="${strokeColor}"/>
          <rect x="180" y="312" width="130" height="8" rx="4" fill="${textMuted}"/>
          <rect x="180" y="328" width="60" height="6" rx="3" fill="${strokeColor}"/>
        </svg>
      `;
    }
  }

  function lock() {
    if (isLocked) return;
    isLocked = true;
    setTimeout(() => {
      isLocked = false;
    }, MOVE_DURATION);
  }

  function step(dir) {
    if (isLocked) return;
    lock();
    active = (((active + dir) % n) + n) % n;
    render();
  }

  function goToSlide(index) {
    if (isLocked || index === active) return;
    lock();
    active = index;
    render();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      step(1);
    }, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function render() {
    const stage = document.getElementById('coverflow-stage');
    if (!stage) return;
    const cards = stage.querySelectorAll('.coverflow-card');
    
    // Check screen width for responsiveness
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    cards.forEach((card, i) => {
      let rel = i - active;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;
      
      const ax = Math.abs(rel);
      
      // Responsive visible counts
      let visible = true;
      if (isMobile) {
        visible = rel === 0;
      } else if (isTablet) {
        visible = ax <= 1;
      } else {
        visible = ax <= 2;
      }

      const isActive = rel === 0;
      
      // Calculate transforms
      const scaleVal = isActive ? 1.0 : 0.82;
      const opacityVal = isActive ? 1.0 : (visible ? 0.55 : 0);
      const translateZVal = isActive ? 40 : (rel > 0 ? -100 - (ax - 1) * 80 : -100 - (ax - 1) * 80);
      const rotateYVal = isActive ? 0 : (rel > 0 ? -20 : 20);
      
      // Horizontal separation distance offset
      let translateXVal = 0;
      if (isMobile) {
        translateXVal = rel * 0;
      } else if (isTablet) {
        translateXVal = rel * 150;
      } else {
        translateXVal = rel * 200;
      }

      card.style.transform = `translate(-50%, -50%) translateX(${translateXVal}px) translateZ(${translateZVal}px) rotateY(${rotateYVal}deg) scale(${scaleVal})`;
      card.style.opacity = opacityVal;
      card.style.pointerEvents = visible ? 'auto' : 'none';
      card.style.cursor = isActive ? 'default' : 'pointer';
      card.style.zIndex = 10 - ax;

      if (isActive) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }

      // Update side dimming
      const dimOverlay = card.querySelector('.coverflow-dim');
      if (dimOverlay) {
        dimOverlay.style.opacity = isActive ? 0 : 0.45;
      }
    });

    // Update Dots
    const dotsContainer = document.getElementById('coverflow-dots');
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.coverflow-dot');
      dots.forEach((dot, idx) => {
        if (idx === active) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  function init() {
    const wrapper = document.getElementById('coverflow-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="coverflow-root" tabindex="0" role="group" aria-roledescription="carousel">
        <div class="coverflow-stage" id="coverflow-stage">
          <!-- Project cards injected dynamically -->
        </div>
      </div>
      <div class="coverflow-controls">
        <div class="coverflow-dots" id="coverflow-dots">
          <!-- Dots injected dynamically -->
        </div>
        <div class="coverflow-arrows">
          <button class="coverflow-arrow" id="cf-prev-btn" aria-label="Previous Project">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="coverflow-arrow" id="cf-next-btn" aria-label="Next Project">
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    `;

    const root = wrapper.querySelector('.coverflow-root');
    const stage = wrapper.querySelector('#coverflow-stage');
    const dotsContainer = wrapper.querySelector('#coverflow-dots');

    // Build Cards
    projects.forEach((proj, i) => {
      // Outlined chips
      const techChipsHTML = proj.tech.map(t => `<span class="tech-chip">${t}</span>`).join('');
      
      const card = document.createElement('div');
      card.className = 'coverflow-card';
      card.style.transition = `transform ${MOVE_DURATION}ms ${EASE}, opacity ${MOVE_DURATION}ms ${EASE}, border-color 300ms, box-shadow 300ms`;
      card.setAttribute('aria-label', proj.name);

      card.innerHTML = `
        <div class="coverflow-card-media">
          ${getMockupSVG(proj.mockupType)}
        </div>
        <div class="coverflow-card-content">
          <h3 class="coverflow-project-name">${proj.name}</h3>
          <p class="coverflow-project-desc">${proj.desc}</p>
          <div class="coverflow-tech-stack">
            ${techChipsHTML}
          </div>
        </div>
        <div class="coverflow-dim"></div>
      `;

      card.addEventListener('click', () => {
        if (isLocked) return;
        if (i !== active) {
          goToSlide(i);
        }
      });

      stage.appendChild(card);

      // Build dot
      const dot = document.createElement('button');
      dot.className = 'coverflow-dot';
      dot.setAttribute('aria-label', `Go to project ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });

    // Control buttons events
    wrapper.querySelector('#cf-prev-btn').addEventListener('click', () => step(-1));
    wrapper.querySelector('#cf-next-btn').addEventListener('click', () => step(1));

    // Keyboard events
    root.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    });

    // Wheel event handler
    let lastWheelTime = 0;
    root.addEventListener('wheel', (e) => {
      const now = Date.now();
      if (now - lastWheelTime < MOVE_DURATION) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaX) > 15 || Math.abs(e.deltaY) > 15) {
        e.preventDefault();
        lastWheelTime = now;
        step(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
      }
    }, {passive: false});

    // Drag and touch events
    root.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 70) {
        step(diff > 0 ? -1 : 1);
        startX = currentX;
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, {passive: true});

    root.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 55) {
        step(diff > 0 ? -1 : 1);
        startX = currentX;
      }
    }, {passive: true});

    root.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Pause on hover
    root.addEventListener('mouseenter', stopAutoPlay);
    root.addEventListener('mouseleave', startAutoPlay);

    // Initial render and start autoplay
    render();
    startAutoPlay();

    // Listen to resize to adapt visible slides count
    window.addEventListener('resize', render);
  }

  // Initial loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
