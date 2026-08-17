const fs = require('fs');

const intern = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/internships.html', 'utf8');
let courses = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', 'utf8');

// 1. Extract Modal HTML
const modalStart = intern.indexOf('<div class="modal-backdrop" id="modal-backdrop">');
const modalEnd = intern.indexOf('</main>', modalStart);
const modalHTML = intern.substring(modalStart, modalEnd);

if (!courses.includes('id="modal-backdrop"')) {
  courses = courses.replace('</body>', modalHTML + '\n</body>');
}

// 2. Extract Carousel & Modal CSS
const cssStart = intern.indexOf('/* ---- carousel ---- */');
const cssEnd = intern.indexOf('/* ---- perks strip ---- */');
const cssStart2 = intern.indexOf('/* ---- split-screen modal ---- */');
const cssEnd2 = intern.indexOf('</style>', cssStart2);

const fullExtraCSS = intern.substring(cssStart, cssEnd) + '\n' + intern.substring(cssStart2, cssEnd2);

if (!courses.includes('/* ---- carousel ---- */')) {
  courses = courses.replace('</style>', fullExtraCSS + '\n</style>');
}

// 3. Extract the JS logic from internships.html
const jsStart = intern.indexOf('const DATA = [');
const jsEnd = intern.lastIndexOf('</script>');
let magneticJS = intern.substring(jsStart, jsEnd);

// Strip out the document.addEventListener('DOMContentLoaded', () => { ... }) wrapper if needed
// Or make it a function initMagneticCarousel()
magneticJS = `
function initMagneticCarousel() {
  if (window.magneticCarouselInitialized) return;
  window.magneticCarouselInitialized = true;
  
  ${magneticJS}
}
`;

if (!courses.includes('function initMagneticCarousel()')) {
  courses = courses.replace('</head>', `<script>\n${magneticJS}\n</script>\n</head>`);
}

// 4. Update setActiveType in courses.html
const oldSetActive = `setActiveType(type) {
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
      if (typeof createCarousel === 'function') {
        createCarousel();
      }
    }
  }`;

const updatedSetActive = `setActiveType(type) {
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
      if (typeof initMagneticCarousel === 'function') {
        initMagneticCarousel();
      }
    }
  }`;

courses = courses.replace(oldSetActive, updatedSetActive);

fs.writeFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', courses);
console.log('Magnetic carousel & modal successfully transferred to courses.html!');
