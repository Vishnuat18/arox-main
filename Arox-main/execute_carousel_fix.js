const fs = require('fs');

const intern = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/internships.html', 'utf8');
let courses = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', 'utf8');

// 1. Extract CSS
const cssStart = intern.indexOf('/* ---- carousel ---- */');
const cssEnd = intern.indexOf('/* ---- perks strip ---- */');
const cssStart2 = intern.indexOf('/* ---- split-screen modal ---- */');
const cssEnd2 = intern.indexOf('</style>', cssStart2);

const fullCSS = intern.substring(cssStart, cssEnd) + '\n' + intern.substring(cssStart2, cssEnd2);

if (!courses.includes('/* ---- carousel ---- */')) {
  courses = courses.replace('</style>', fullCSS + '\n</style>');
}

// 2. Extract Modal HTML
const modalStart = intern.indexOf('<div class="modal-backdrop" id="modal-backdrop">');
const modalEnd = intern.indexOf('</main>', modalStart);
const modalHTML = intern.substring(modalStart, modalEnd);

if (!courses.includes('id="modal-backdrop"')) {
  courses = courses.replace('</body>', modalHTML + '\n</body>');
}

// 3. Carousel HTML
const carouselHTML = `
  <div id="internshipCarouselWrap" style="display:none; width:100%; padding: 2rem 0;">
    <div class="carousel-scroll">
      <div class="carousel-container" id="carousel-container"></div>
    </div>
    <p style="text-align:center;color:var(--muted);font-size:.875rem;margin-top:1rem;">
      Hover the bars to expand a program &middot; click <strong style="color:var(--heading);">Apply Now</strong> to start your application
    </p>
  </div>
`;

if (courses.includes('id="internshipPerks"')) {
  const pStart = courses.indexOf('<div id="internshipPerks"');
  const pEnd = courses.indexOf('</div>\n  <div class="scroll-hint"', pStart);
  courses = courses.slice(0, pStart) + carouselHTML + courses.slice(pEnd);
} else if (!courses.includes('id="internshipCarouselWrap"')) {
  const trackEnd = courses.indexOf('</div>', courses.indexOf('id="hscrollTrack"')) + 6;
  courses = courses.slice(0, trackEnd) + '\n' + carouselHTML + courses.slice(trackEnd);
}

// 4. Extract Magnetic JS
const jsStart = intern.indexOf('const DATA = [');
const jsEnd = intern.lastIndexOf('</script>');
const rawJS = intern.substring(jsStart, jsEnd);

const wrappedJS = `
<script>
window.initMagneticCarousel = function() {
  if (window.magneticCarouselInitialized) return;
  window.magneticCarouselInitialized = true;

  ${rawJS}
};
</script>
`;

if (!courses.includes('window.initMagneticCarousel')) {
  courses = courses.replace('</head>', wrappedJS + '\n</head>');
}

// 5. Update setActiveType in courses.html
const targetFunc = courses.substring(courses.indexOf('setActiveType(type) {'), courses.indexOf('setActiveType(type) {') + 600);

const replacementFunc = `setActiveType(type) {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector('.pill-btn[data-type="' + type + '"]');
    if (targetBtn) targetBtn.classList.add('active');

    const hscrollTrack = document.getElementById('hscrollTrack');
    const carouselWrap = document.getElementById('internshipCarouselWrap');
    const scrollHint = document.querySelector('.scroll-hint');

    if (type === 'training') {
      if (hscrollTrack) hscrollTrack.style.display = 'flex';
      if (carouselWrap) carouselWrap.style.display = 'none';
      if (scrollHint) scrollHint.style.display = 'flex';
      buildFlipCards('training');
    } else {
      if (hscrollTrack) hscrollTrack.style.display = 'none';
      if (carouselWrap) carouselWrap.style.display = 'block';
      if (scrollHint) scrollHint.style.display = 'none';
      if (typeof window.initMagneticCarousel === 'function') {
        window.initMagneticCarousel();
      }
    }
  }`;

courses = courses.replace(targetFunc, replacementFunc);

fs.writeFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', courses);
console.log('Carousel fix completed successfully!');
