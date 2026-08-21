const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const stylePath = path.join(__dirname, 'style.css');
const scriptPath = path.join(__dirname, 'script.js');

const content = fs.readFileSync(indexPath, 'utf-8');
const lines = content.split(/\r?\n/);

// Extract CSS (lines 12 to 119)
// Note: array is 0-indexed, so lines[11] to lines[118]
const cssLines = lines.slice(11, 119);
fs.writeFileSync(stylePath, cssLines.join('\n'));

// Extract JS (lines 284 to 594)
// lines[283] to lines[593]
const jsLines = lines.slice(283, 594);
fs.writeFileSync(scriptPath, jsLines.join('\n'));

// Modify index.html
const newIndexLines = [
  ...lines.slice(0, 11),
  '  <link rel="stylesheet" href="style.css">',
  ...lines.slice(119, 283),
  '<script src="script.js"></script>',
  ...lines.slice(594)
];

fs.writeFileSync(indexPath, newIndexLines.join('\n'));
console.log('Files split successfully.');
