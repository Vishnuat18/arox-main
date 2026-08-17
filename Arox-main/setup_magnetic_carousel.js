const fs = require('fs');

const intern = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/internships.html', 'utf8');
let courses = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', 'utf8');

// 1. Extract Carousel CSS
const cssStart = intern.indexOf('/* ---- carousel ---- */');
const cssEnd = intern.indexOf('/* ---- perks strip ---- */');
const carouselCSS = intern.substring(cssStart, cssEnd);

if (!courses.includes('/* ---- carousel ---- */')) {
  courses = courses.replace('</style>', carouselCSS + '\n</style>');
}

// 2. Extract Carousel HTML
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

// Replace internshipPerks with internshipCarouselWrap
if (courses.includes('id="internshipPerks"')) {
  const perksStart = courses.indexOf('<div id="internshipPerks"');
  const perksEnd = courses.indexOf('</div>\n  <div class="scroll-hint"', perksStart);
  courses = courses.slice(0, perksStart) + carouselHTML + courses.slice(perksEnd);
} else if (!courses.includes('id="internshipCarouselWrap"')) {
  const hscrollEnd = courses.indexOf('</div>', courses.indexOf('id="hscrollTrack"')) + 6;
  courses = courses.slice(0, hscrollEnd) + '\n' + carouselHTML + courses.slice(hscrollEnd);
}

// 3. Extract Carousel JS (DATA array & createCarousel)
const jsStart = intern.indexOf('const DATA = [');
const jsEnd = intern.indexOf('/* ---- scroll reveal ---- */');
const carouselJS = intern.substring(jsStart, jsEnd);

if (!courses.includes('const DATA = [')) {
  courses = courses.replace('/* ──────── BUILD FLIP CARDS ──────── */', carouselJS + '\n\n/* ──────── BUILD FLIP CARDS ──────── */');
}

// 4. Update setActiveType JS logic to toggle correctly
const oldSetActive = `setActiveType(type) {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector('.pill-btn[data-type="' + type + '"]');
    if (targetBtn) targetBtn.classList.add('active');
    buildFlipCards(type);
    if (internBand) {
      internBand.style.display = type === 'internship' ? '' : 'none';
    }
    if (bootcampsSection) {
      bootcampsSection.style.display = type === 'training' ? '' : 'none';
    }
  }`;

const newSetActive = `setActiveType(type) {
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

courses = courses.replace(oldSetActive, newSetActive);

fs.writeFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', courses);
console.log('Successfully set up magnetic carousel in courses.html!');
