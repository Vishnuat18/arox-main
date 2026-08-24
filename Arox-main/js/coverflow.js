(function () {
  'use strict';

  // Carousel config settings
  const MOVE_DURATION = 700; // ms
  const EASE = 'cubic-bezier(0.25, 0.8, 0.25, 1)';
  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

  const projects = [
    {
      id: "nova-ai",
      tag: "AI & Analytics",
      name: "Nova AI",
      desc: "Collaborative predictive modeling workspace for data science and analytics teams.",
      tech: ["React", "TypeScript", "Python", "Framer Motion", "CI/CD"],
      svg: `
        <svg viewBox="0 0 900 520" role="img" aria-label="Nova AI dashboard illustration" style="width:100%;height:100%;display:block;border-radius:18px;">
          <defs>
            <linearGradient id="novaBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#eef5ff"/>
              <stop offset="1" stop-color="#ffffff"/>
            </linearGradient>
            <linearGradient id="novaBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#1264ff"/>
              <stop offset="1" stop-color="#73a6ff"/>
            </linearGradient>
            <filter id="shadowNova">
              <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#1264ff" flood-opacity=".12"/>
            </filter>
            <filter id="glowNova" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <rect width="900" height="520" fill="url(#novaBg)" rx="20"/>
          <circle cx="110" cy="75" r="90" fill="#1264ff" opacity=".06"/>
          <circle cx="800" cy="440" r="120" fill="#1264ff" opacity=".05"/>

          <g filter="url(#shadowNova)">
            <rect x="90" y="75" width="720" height="370" rx="26" fill="#fff" stroke="#d8e6fa"/>
          </g>

          <rect x="115" y="100" width="670" height="40" rx="10" fill="#f5f8ff"/>
          <circle cx="140" cy="120" r="6" fill="#1264ff"/>
          <rect x="155" y="114" width="90" height="11" rx="5.5" fill="#b9ccef"/>
          <rect x="620" y="112" width="55" height="16" rx="8" fill="#eaf2ff"/>
          <rect x="682" y="112" width="76" height="16" rx="8" fill="#1264ff" opacity=".18"/>

          <rect x="115" y="165" width="160" height="245" rx="16" fill="#f8fbff" stroke="#e4edf9"/>
          <circle cx="145" cy="195" r="18" fill="#1264ff" opacity=".12"/>
          <rect x="175" y="185" width="65" height="12" rx="6" fill="#7891b9"/>
          <rect x="140" y="240" width="105" height="9" rx="4.5" fill="#dae5f4"/>
          <rect x="140" y="265" width="80" height="9" rx="4.5" fill="#dae5f4"/>
          <rect x="140" y="290" width="94" height="9" rx="4.5" fill="#dae5f4"/>
          <rect x="140" y="336" width="106" height="48" rx="12" fill="#eaf2ff"/>
          <circle cx="164" cy="360" r="11" fill="#1264ff"/>
          <rect x="184" y="351" width="40" height="8" rx="4" fill="#7891b9"/>

          <rect x="305" y="165" width="455" height="245" rx="16" fill="#fff" stroke="#e4edf9"/>
          <rect x="330" y="190" width="110" height="12" rx="6" fill="#6f83a3"/>
          <rect x="330" y="215" width="175" height="8" rx="4" fill="#dce7f5"/>

          <polyline
            points="330,355 380,315 430,330 480,280 530,305 580,245 630,270 680,215 730,238"
            fill="none"
            stroke="url(#novaBlue)"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#glowNova)"
          />

          <g fill="#1264ff">
            <circle cx="330" cy="355" r="7"/>
            <circle cx="380" cy="315" r="7"/>
            <circle cx="430" cy="330" r="7"/>
            <circle cx="480" cy="280" r="7"/>
            <circle cx="530" cy="305" r="7"/>
            <circle cx="580" cy="245" r="7"/>
            <circle cx="630" cy="270" r="7"/>
            <circle cx="680" cy="215" r="7"/>
            <circle cx="730" cy="238" r="7"/>
          </g>

          <rect x="330" y="372" width="55" height="14" rx="7" fill="#1264ff" opacity=".10"/>
          <rect x="397" y="372" width="90" height="14" rx="7" fill="#edf3fb"/>
          <rect x="500" y="372" width="78" height="14" rx="7" fill="#edf3fb"/>
        </svg>
      `
    },
    {
      id: "helios-cloud",
      tag: "Cloud Infrastructure",
      name: "Helios Cloud",
      desc: "Distributed cloud infrastructure and performance platform built for scale.",
      tech: ["Next.js", "Node.js", "TailwindCSS", "TypeScript"],
      svg: `
        <svg viewBox="0 0 900 520" role="img" aria-label="Helios Cloud illustration" style="width:100%;height:100%;display:block;border-radius:18px;">
          <defs>
            <linearGradient id="heliosBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#eff5ff"/>
              <stop offset="1" stop-color="#ffffff"/>
            </linearGradient>
            <linearGradient id="heliosCloud" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#6f9cff"/>
              <stop offset="1" stop-color="#1264ff"/>
            </linearGradient>
          </defs>

          <rect width="900" height="520" fill="url(#heliosBg)" rx="20"/>
          <circle cx="760" cy="90" r="100" fill="#1264ff" opacity=".06"/>

          <g transform="translate(105 72)">
            <rect width="690" height="360" rx="30" fill="#fff" stroke="#d9e6f8"/>
          </g>

          <g transform="translate(170 140)">
            <ellipse cx="260" cy="165" rx="190" ry="90" fill="#eaf2ff"/>
            <path
              d="M135 168
                 C135 112 178 74 228 74
                 C260 35 326 38 352 86
                 C405 78 448 111 448 160
                 C488 160 518 188 518 224
                 C518 265 482 290 438 290
                 H145
                 C95 290 65 265 65 226
                 C65 189 92 168 135 168Z"
              fill="url(#heliosCloud)"
              opacity=".96"
            />

            <path
              d="M142 160
                 C142 122 172 101 209 101
                 C245 52 310 60 330 108
                 C375 96 414 121 416 162
                 C451 161 477 182 477 211
                 C477 239 450 255 414 255
                 H165
                 C129 255 103 239 103 211
                 C103 184 118 164 142 160Z"
              fill="#ffffff"
              opacity=".93"
            />

            <circle cx="258" cy="176" r="10" fill="#1264ff"/>
            <circle cx="300" cy="176" r="10" fill="#1264ff" opacity=".65"/>
            <circle cx="342" cy="176" r="10" fill="#1264ff" opacity=".38"/>

            <rect x="214" y="206" width="172" height="9" rx="4.5" fill="#1264ff" opacity=".16"/>
            <rect x="242" y="226" width="116" height="8" rx="4" fill="#d4e1f2"/>
          </g>

          <g opacity=".38" stroke="#1264ff" stroke-width="4" fill="none">
            <path d="M100 210 H40"/>
            <path d="M795 210 H860"/>
            <path d="M155 325 H75"/>
            <path d="M745 325 H825"/>
          </g>
          <g fill="#1264ff" opacity=".45">
            <circle cx="40" cy="210" r="7"/>
            <circle cx="860" cy="210" r="7"/>
            <circle cx="75" cy="325" r="7"/>
            <circle cx="825" cy="325" r="7"/>
          </g>
        </svg>
      `
    },
    {
      id: "vesper-chat",
      tag: "Collaboration Platform",
      name: "Vesper Chat",
      desc: "Encrypted real-time messaging and collaboration space for secure, high-performing teams.",
      tech: ["React", "Node.js", "MongoDB", "Firebase", "TypeScript"],
      svg: `
        <svg viewBox="0 0 1200 540" role="img" aria-label="Vesper Chat illustration" style="width:100%;height:100%;display:block;border-radius:18px;">
          <defs>
            <linearGradient id="vesperBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#eaf3ff"/>
              <stop offset=".55" stop-color="#ffffff"/>
              <stop offset="1" stop-color="#f4f8ff"/>
            </linearGradient>
            <linearGradient id="vesperBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#1264ff"/>
              <stop offset="1" stop-color="#4c8cff"/>
            </linearGradient>
            <filter id="vesperShadow">
              <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#1264ff" flood-opacity=".16"/>
            </filter>
          </defs>

          <rect width="1200" height="540" fill="url(#vesperBg)" rx="24"/>

          <circle cx="110" cy="90" r="120" fill="#1264ff" opacity=".05"/>
          <circle cx="1080" cy="420" r="140" fill="#1264ff" opacity=".05"/>

          <g filter="url(#vesperShadow)">
            <rect x="170" y="60" width="860" height="410" rx="32" fill="#fff" stroke="#d8e6fa"/>
          </g>

          <!-- sidebar -->
          <rect x="195" y="85" width="230" height="360" rx="20" fill="#f7faff"/>
          <rect x="220" y="110" width="180" height="35" rx="11" fill="#eaf2ff"/>
          <circle cx="242" cy="127" r="10" fill="#1264ff"/>
          <rect x="260" y="121" width="80" height="10" rx="5" fill="#91a7c5"/>

          <!-- users -->
          <g>
            <circle cx="238" cy="182" r="18" fill="#dfeaff"/>
            <circle cx="238" cy="229" r="18" fill="#c7dcff"/>
            <circle cx="238" cy="276" r="18" fill="#e9d9ff"/>
            <circle cx="238" cy="323" r="18" fill="#d8f1ef"/>

            <rect x="270" y="174" width="105" height="9" rx="4.5" fill="#8094b2"/>
            <rect x="270" y="221" width="90" height="9" rx="4.5" fill="#8094b2"/>
            <rect x="270" y="268" width="82" height="9" rx="4.5" fill="#8094b2"/>
            <rect x="270" y="315" width="100" height="9" rx="4.5" fill="#8094b2"/>
          </g>

          <!-- main chat -->
          <rect x="450" y="85" width="555" height="360" rx="20" fill="#fff"/>
          <rect x="480" y="110" width="150" height="12" rx="6" fill="#657997"/>
          <rect x="480" y="138" width="85" height="8" rx="4" fill="#d7e2f1"/>

          <rect x="480" y="190" width="280" height="58" rx="18" fill="#f1f5fb"/>
          <rect x="505" y="208" width="175" height="8" rx="4" fill="#8395b0"/>
          <rect x="505" y="226" width="120" height="7" rx="3.5" fill="#c5d3e6"/>

          <rect x="650" y="268" width="275" height="64" rx="20" fill="url(#vesperBlue)"/>
          <rect x="678" y="288" width="160" height="8" rx="4" fill="#ffffff" opacity=".92"/>
          <rect x="678" y="306" width="110" height="7" rx="3.5" fill="#ffffff" opacity=".48"/>

          <rect x="495" y="350" width="190" height="55" rx="18" fill="#f1f5fb"/>
          <rect x="520" y="367" width="110" height="8" rx="4" fill="#8395b0"/>
          <rect x="520" y="385" width="82" height="7" rx="3.5" fill="#c5d3e6"/>

          <!-- typing -->
          <circle cx="930" cy="370" r="7" fill="#1264ff"/>
          <circle cx="950" cy="370" r="7" fill="#1264ff" opacity=".55"/>
          <circle cx="970" cy="370" r="7" fill="#1264ff" opacity=".25"/>
        </svg>
      `
    },
    {
      id: "aether-erp",
      tag: "Business Management",
      name: "Aether ERP",
      desc: "Integrated enterprise resource planning solution for growing and scaling businesses.",
      tech: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB"],
      svg: `
        <svg viewBox="0 0 900 520" role="img" aria-label="Aether ERP illustration" style="width:100%;height:100%;display:block;border-radius:18px;">
          <defs>
            <linearGradient id="erpBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#edf5ff"/>
              <stop offset="1" stop-color="#ffffff"/>
            </linearGradient>
          </defs>

          <rect width="900" height="520" fill="url(#erpBg)" rx="20"/>

          <g transform="translate(120 70)">
            <rect width="660" height="380" rx="28" fill="#fff" stroke="#d9e6f8"/>
            <rect x="28" y="28" width="604" height="54" rx="14" fill="#f7faff"/>

            <circle cx="58" cy="55" r="10" fill="#1264ff"/>
            <rect x="80" y="47" width="90" height="10" rx="5" fill="#8095b3"/>
            <rect x="505" y="44" width="48" height="18" rx="9" fill="#eaf2ff"/>
            <rect x="560" y="44" width="42" height="18" rx="9" fill="#1264ff" opacity=".18"/>

            <rect x="28" y="102" width="170" height="245" rx="17" fill="#f7faff"/>
            <circle cx="65" cy="138" r="16" fill="#1264ff" opacity=".12"/>
            <rect x="94" y="132" width="75" height="10" rx="5" fill="#7f93af"/>

            <rect x="58" y="185" width="110" height="34" rx="9" fill="#eaf2ff"/>
            <rect x="58" y="232" width="110" height="12" rx="6" fill="#dce7f4"/>
            <rect x="58" y="258" width="85" height="12" rx="6" fill="#dce7f4"/>
            <rect x="58" y="284" width="98" height="12" rx="6" fill="#dce7f4"/>

            <rect x="225" y="102" width="405" height="245" rx="17" fill="#fff" stroke="#e5edf8"/>
            <rect x="250" y="126" width="120" height="10" rx="5" fill="#70839f"/>

            <!-- bars -->
            <rect x="255" y="286" width="28" height="38" rx="6" fill="#b9d1ff"/>
            <rect x="300" y="250" width="28" height="74" rx="6" fill="#76a5ff"/>
            <rect x="345" y="220" width="28" height="104" rx="6" fill="#1264ff"/>
            <rect x="390" y="260" width="28" height="64" rx="6" fill="#4b89ff"/>
            <rect x="435" y="205" width="28" height="119" rx="6" fill="#1264ff"/>
            <rect x="480" y="235" width="28" height="89" rx="6" fill="#76a5ff"/>
            <rect x="525" y="190" width="28" height="134" rx="6" fill="#1264ff"/>

            <line x1="250" y1="324" x2="595" y2="324" stroke="#dbe6f4" stroke-width="3"/>

            <circle cx="548" cy="158" r="26" fill="#eaf2ff"/>
            <path d="M536 159 L546 168 L563 145" fill="none" stroke="#1264ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      `
    },
    {
      id: "orbit-workflows",
      tag: "Automation",
      name: "Orbit Workflows",
      desc: "Automate business processes with visual workflows and smart integrations.",
      tech: ["React", "Node.js", "TypeScript", "n8n", "Redis"],
      svg: `
        <svg viewBox="0 0 900 520" role="img" aria-label="Orbit Workflows illustration" style="width:100%;height:100%;display:block;border-radius:18px;">
          <defs>
            <linearGradient id="orbitBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#eef5ff"/>
              <stop offset="1" stop-color="#ffffff"/>
            </linearGradient>
            <linearGradient id="orbitLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#1264ff"/>
              <stop offset="1" stop-color="#82acff"/>
            </linearGradient>
          </defs>

          <rect width="900" height="520" fill="url(#orbitBg)" rx="20"/>

          <circle cx="450" cy="260" r="175" fill="none" stroke="#1264ff" stroke-opacity=".06" stroke-width="2"/>
          <circle cx="450" cy="260" r="125" fill="none" stroke="#1264ff" stroke-opacity=".08" stroke-width="2"/>

          <!-- connector path -->
          <path
            d="M180 260
               C250 120 350 120 420 260
               C490 400 600 400 720 255"
            fill="none"
            stroke="url(#orbitLine)"
            stroke-width="8"
            stroke-linecap="round"
          />

          <path
            d="M180 260
               C250 120 350 120 420 260
               C490 400 600 400 720 255"
            fill="none"
            stroke="#ffffff"
            stroke-width="3"
            stroke-dasharray="10 13"
            opacity=".85"
          />

          <!-- nodes -->
          <g>
            <rect x="115" y="220" width="130" height="80" rx="18" fill="#ffffff" stroke="#d8e6fa"/>
            <circle cx="145" cy="260" r="14" fill="#eaf2ff"/>
            <path d="M137 260 L144 267 L156 251" fill="none" stroke="#1264ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="168" y="251" width="48" height="8" rx="4" fill="#8094b0"/>
            <rect x="168" y="266" width="35" height="7" rx="3.5" fill="#d5e1ef"/>

            <rect x="385" y="220" width="130" height="80" rx="18" fill="#1264ff"/>
            <circle cx="415" cy="260" r="14" fill="#ffffff" opacity=".18"/>
            <path d="M407 260 L414 267 L426 251" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="438" y="251" width="48" height="8" rx="4" fill="#ffffff" opacity=".9"/>
            <rect x="438" y="266" width="35" height="7" rx="3.5" fill="#ffffff" opacity=".4"/>

            <rect x="655" y="220" width="130" height="80" rx="18" fill="#ffffff" stroke="#d8e6fa"/>
            <circle cx="685" cy="260" r="14" fill="#eaf2ff"/>
            <path d="M677 260 L684 267 L696 251" fill="none" stroke="#1264ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="708" y="251" width="48" height="8" rx="4" fill="#8094b0"/>
            <rect x="708" y="266" width="35" height="7" rx="3.5" fill="#d5e1ef"/>
          </g>

          <!-- center automation core -->
          <circle cx="450" cy="260" r="55" fill="#eaf2ff"/>
          <circle cx="450" cy="260" r="38" fill="#1264ff"/>
          <circle cx="450" cy="260" r="14" fill="#ffffff"/>
        </svg>
      `
    }
  ];

  const n = projects.length;
  let active = 0;
  let isLocked = false;
  let autoPlayTimer = null;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

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
          ${proj.svg}
        </div>
        <div class="coverflow-card-content">
          ${proj.tag ? `<span class="coverflow-project-tag">${proj.tag}</span>` : ''}
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
