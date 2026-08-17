const fs = require('fs');

try {
  const intern = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/internships.html', 'utf8');
  let courses = fs.readFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', 'utf8');

  // Find perks-section HTML in internships.html
  const perksHTMLStart = intern.indexOf('<section class="perks-section">');
  const perksHTMLEnd = intern.indexOf('</section>', perksHTMLStart) + 10;
  let perksHTML = intern.substring(perksHTMLStart, perksHTMLEnd);
  
  // Replace section with div id="internshipPerks"
  perksHTML = perksHTML.replace('perks-section', 'perks-section internship-perks');
  perksHTML = perksHTML.replace('<section', '<div id="internshipPerks" style="display:none; width:100%;"');
  perksHTML = perksHTML.replace('</section>', '</div>');

  // Find perks CSS in internships.html
  const cssStart = intern.indexOf('/* ---- perks strip ---- */');
  const cssEnd = intern.indexOf('/* ---- split-screen modal ---- */');
  const perksCSS = intern.substring(cssStart, cssEnd);

  // Inject CSS into courses.html
  if (!courses.includes('/* ---- perks strip ---- */')) {
    courses = courses.replace('</style>', perksCSS + '\n</style>');
  }

  // Inject HTML into courses.html
  const target = '<div id="internshipCarouselContainer" style="display: none; width: 100%;"></div>';
  if (courses.includes(target)) {
    courses = courses.replace(target, perksHTML);
  } else if (!courses.includes('id="internshipPerks"')) {
    const hscrollEnd = courses.indexOf('</div>', courses.indexOf('id="hscrollTrack"')) + 6;
    courses = courses.slice(0, hscrollEnd) + '\n' + perksHTML + courses.slice(hscrollEnd);
  }

  // Update setActiveType logic
  courses = courses.replace(/carouselContainer\.style\.display\s*=\s*'flex';/g, "document.getElementById('internshipPerks').style.display = 'block';");
  courses = courses.replace(/carouselContainer\.style\.display\s*=\s*'none';/g, "document.getElementById('internshipPerks').style.display = 'none';");
  
  // Also fix the querySelector for carouselContainer if it throws errors
  courses = courses.replace("const carouselContainer = document.getElementById('internshipCarouselContainer');", "const carouselContainer = document.getElementById('internshipPerks');");

  fs.writeFileSync('c:/Users/vishn/Desktop/Projects/Arox/Arox-main/courses.html', courses);
  console.log('Successfully updated courses.html with perks section!');
} catch (e) {
  console.error(e);
}
