import * as THREE from 'three';

// ── SVG DATA URLS FOR ALL 9 LOGOS ──
const SVG_DATA_URLS = {
  react: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`),

  figma: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><path fill="#0acf83" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"/><path fill="#a259ff" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"/><path fill="#f24e1e" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"/><path fill="#ff7262" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"/><path fill="#1abcfe" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"/></svg>`),

  python: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.21 -0.077 110 110"><linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="63.8" y1="56.6" x2="118.4" y2="1.8" gradientTransform="matrix(1 0 0 -1 -53.2 66.4)"><stop offset="0" stop-color="#387EB8"/><stop offset="1" stop-color="#366994"/></linearGradient><path fill="url(#g1)" d="M55.023-0.077c-25.971,0-26.25,10.081-26.25,12.156c0,3.148,0,12.594,0,12.594h26.75v3.781c0,0-27.852,0-37.375,0c-7.949,0-17.938,4.833-17.938,26.25c0,19.673,7.792,27.281,15.656,27.281c2.335,0,9.344,0,9.344,0s0-9.765,0-13.125c0-5.491,2.721-15.656,15.406-15.656c15.91,0,19.971,0,26.531,0c3.902,0,14.906-1.696,14.906-14.406c0-13.452,0-17.89,0-24.219C82.054,11.426,81.515-0.077,55.023-0.077z M40.273,8.392c2.662,0,4.813,2.15,4.813,4.813c0,2.661-2.151,4.813-4.813,4.813s-4.813-2.151-4.813-4.813C35.46,10.542,37.611,8.392,40.273,8.392z"/><linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="97" y1="21.6" x2="155.6" y2="-34.5" gradientTransform="matrix(1 0 0 -1 -53.2 66.4)"><stop offset="0" stop-color="#FFE052"/><stop offset="1" stop-color="#FFC331"/></linearGradient><path fill="url(#g2)" d="M55.397,109.923c25.959,0,26.282-10.271,26.282-12.156c0-3.148,0-12.594,0-12.594H54.897v-3.781c0,0,28.032,0,37.375,0c8.009,0,17.938-4.954,17.938-26.25c0-23.322-10.538-27.281-15.656-27.281c-2.336,0-9.344,0-9.344,0s0,10.216,0,13.125c0,5.491-2.631,15.656-15.406,15.656c-15.91,0-19.476,0-26.532,0c-3.892,0-14.906,1.896-14.906,14.406c0,14.475,0,18.265,0,24.219C28.366,100.497,31.562,109.923,55.397,109.923z M70.148,101.454c-2.662,0-4.813-2.151-4.813-4.813s2.15-4.813,4.813-4.813c2.661,0,4.813,2.151,4.813,4.813S72.809,101.454,70.148,101.454z"/></svg>`),

  linux: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><rect x="15" y="15" width="270" height="120" rx="14" fill="none" stroke="#2563eb" stroke-width="12"/><text x="45" y="102" font-size="76" font-weight="800" fill="#2563eb" font-family="Arial, sans-serif" letter-spacing="4">KALI</text></svg>`),

  meta: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><path fill="#0064e0" fill-rule="evenodd" d="M225.8 25c-25.2 0-47.5 13.9-64.2 34.6-19.1 23.6-35.8 53-50.4 80-14.6-27-31.3-56.4-50.4-80C94.1 38.9 71.8 25 46.6 25 15.6 25 0 45.6 0 76.7c0 43.1 34.5 78.3 76.6 78.3 25.2 0 47.5-13.9 64.2-34.6 18.4-22.8 34.4-50.9 48.6-77.4 14.2 26.5 30.2 54.6 48.6 77.4 16.7 20.7 39 34.6 64.2 34.6 31 0 57.8-20.6 57.8-51.7C300 60.1 265.5 25 225.8 25zm-179.2 95c-19.1 0-34.7-15.6-34.7-34.7s15.6-34.7 34.7-34.7c8.5 0 16.3 4.5 22.5 12.1 9.2 11.3 18 26.6 25.5 40.8-7.7 14.5-16.3 29.5-25.5 40.8-6.2 7.6-14 12.1-22.5 12.1zm179.2 0c-8.5 0-16.3-4.5-22.5-12.1-9.2-11.3-18-26.4-25.5-40.8 7.5-14.2 16.3-29.5 25.5-40.8 6.2-7.6 14-12.1 22.5-12.1 19.1 0 34.7 15.6 34.7 34.7s-15.6 34.7-34.7 34.7z"/></svg>`),

  cpp: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140"><polygon points="70,8 126,36 126,104 70,132 14,104 14,36" fill="none" stroke="#0064e0" stroke-width="10"/><text x="70" y="72" font-size="44" font-weight="900" fill="#0064e0" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle" dominant-baseline="central">C++</text></svg>`),

  aws: 'data:image/svg+xml;base64,' + btoa(`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 182"><g><path fill="#ffffff" d="M86.4,66.4c0,3.7,0.4,6.7,1.1,8.9c0.8,2.2,1.8,4.6,3.2,7.2c0.5,0.8,0.7,1.6,0.7,2.3c0,1-0.6,2-1.9,3l-6.3,4.2c-0.9,0.6-1.8,0.9-2.6,0.9c-1,0-2-0.5-3-1.4C76.2,90,75,88.4,74,86.8c-1-1.7-2-3.6-3.1-5.9c-7.8,9.2-17.6,13.8-29.4,13.8c-8.4,0-15.1-2.4-20-7.2c-4.9-4.8-7.4-11.2-7.4-19.2c0-8.5,3-15.4,9.1-20.6c6.1-5.2,14.2-7.8,24.5-7.8c3.4,0,6.9,0.3,10.6,0.8c3.7,0.5,7.5,1.3,11.5,2.2v-7.3c0-7.6-1.6-12.9-4.7-16c-3.2-3.1-8.6-4.6-16.3-4.6c-3.5,0-7.1,0.4-10.8,1.3c-3.7,0.9-7.3,2-10.8,3.4c-1.6,0.7-2.8,1.1-3.5,1.3c-0.7,0.2-1.2,0.3-1.6,0.3c-1.4,0-2.1-1-2.1-3.1v-4.9c0-1.6,0.2-2.8,0.7-3.5c0.5-0.7,1.4-1.4,2.8-2.1c3.5-1.8,7.7-3.3,12.6-4.5c4.9-1.3,10.1-1.9,15.6-1.9c11.9,0,20.6,2.7,26.2,8.1c5.5,5.4,8.3,13.6,8.3,24.6V66.4z M45.8,81.6c3.3,0,6.7-0.6,10.3-1.8c3.6-1.2,6.8-3.4,9.5-6.4c1.6-1.9,2.8-4,3.4-6.4c0.6-2.4,1-5.3,1-8.7v-4.2c-2.9-0.7-6-1.3-9.2-1.7c-3.2-0.4-6.3-0.6-9.4-0.6c-6.7,0-11.6,1.3-14.9,4c-3.3,2.7-4.9,6.5-4.9,11.5c0,4.7,1.2,8.2,3.7,10.6C37.7,80.4,41.2,81.6,45.8,81.6z M126.1,92.4c-1.8,0-3-0.3-3.8-1c-0.8-0.6-1.5-2-2.1-3.9L96.7,10.2c-0.6-2-0.9-3.3-0.9-4c0-1.6,0.8-2.5,2.4-2.5h9.8c1.9,0,3.2,0.3,3.9,1c0.8,0.6,1.4,2,2,3.9l16.8,66.2l15.6-66.2c0.5-2,1.1-3.3,1.9-3.9c0.8-0.6,2.2-1,4-1h8c1.9,0,3.2,0.3,4,1c0.8,0.6,1.5,2,1.9,3.9l15.8,67l17.3-67c0.6-2,1.3-3.3,2-3.9c0.8-0.6,2.1-1,3.9-1h9.3c1.6,0,2.5,0.8,2.5,2.5c0,0.5-0.1,1-0.2,1.6c-0.1,0.6-0.3,1.4-0.7,2.5l-24.1,77.3c-0.6,2-1.3,3.3-2.1,3.9c-0.8,0.6-2.1,1-3.8,1h-8.6c-1.9,0-3.2-0.3-4-1c-0.8-0.7-1.5-2-1.9-4L156,23l-15.4,64.4c-0.5,2-1.1,3.3-1.9,4c-0.8,0.7-2.2,1-4,1H126.1z M254.6,95.1c-5.2,0-10.4-0.6-15.4-1.8c-5-1.2-8.9-2.5-11.5-4c-1.6-0.9-2.7-1.9-3.1-2.8c-0.4-0.9-0.6-1.9-0.6-2.8v-5.1c0-2.1,0.8-3.1,2.3-3.1c0.6,0,1.2,0.1,1.8,0.3c0.6,0.2,1.5,0.6,2.5,1c3.4,1.5,7.1,2.7,11,3.5c4,0.8,7.9,1.2,11.9,1.2c6.3,0,11.2-1.1,14.6-3.3c3.4-2.2,5.2-5.4,5.2-9.5c0-2.8-0.9-5.1-2.7-7c-1.8-1.9-5.2-3.6-10.1-5.2L246,52c-7.3-2.3-12.7-5.7-16-10.2c-3.3-4.4-5-9.3-5-14.5c0-4.2,0.9-7.9,2.7-11.1c1.8-3.2,4.2-6,7.2-8.2c3-2.3,6.4-4,10.4-5.2c4-1.2,8.2-1.7,12.6-1.7c2.2,0,4.5,0.1,6.7,0.4c2.3,0.3,4.4,0.7,6.5,1.1c2,0.5,3.9,1,5.7,1.6c1.8,0.6,3.2,1.2,4.2,1.8c1.4,0.8,2.4,1.6,3,2.5c0.6,0.8,0.9,1.9,0.9,3.3v4.7c0,2.1-0.8,3.2-2.3,3.2c-0.8,0-2.1-0.4-3.8-1.2c-5.7-2.6-12.1-3.9-19.2-3.9c-5.7,0-10.2,0.9-13.3,2.8c-3.1,1.9-4.7,4.8-4.7,8.9c0,2.8,1,5.2,3,7.1c2,1.9,5.7,3.8,11,5.5l14.2,4.5c7.2,2.3,12.4,5.5,15.5,9.6c3.1,4.1,4.6,8.8,4.6,14c0,4.3-0.9,8.2-2.6,11.6c-1.8,3.4-4.2,6.4-7.3,8.8c-3.1,2.5-6.8,4.3-11.1,5.6C264.4,94.4,259.7,95.1,254.6,95.1z"/><path fill="#FF9900" d="M273.5,143.7c-32.9,24.3-80.7,37.2-121.8,37.2c-57.6,0-109.5-21.3-148.7-56.7c-3.1-2.8-0.3-6.6,3.4-4.4c42.4,24.6,94.7,39.5,148.8,39.5c36.5,0,76.6-7.6,113.5-23.2C274.2,133.6,278.9,139.7,273.5,143.7z"/><path fill="#FF9900" d="M287.2,128.1c-4.2-5.4-27.8-2.6-38.5-1.3c-3.2,0.4-3.7-2.4-0.8-4.5c18.8-13.2,49.7-9.4,53.3-5c3.6,4.5-1,35.4-18.6,50.2c-2.7,2.3-5.3,1.1-4.1-1.9C282.5,155.7,291.4,133.4,287.2,128.1z"/></g></svg>`),

  mobile: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><g fill="#a4c639"><line x1="60" y1="36" x2="36" y2="12" stroke="#a4c639" stroke-width="8" stroke-linecap="round"/><line x1="140" y1="36" x2="164" y2="12" stroke="#a4c639" stroke-width="8" stroke-linecap="round"/><path d="M 40 70 A 60 60 0 0 1 160 70 Z"/><circle cx="75" cy="50" r="5" fill="#ffffff"/><circle cx="125" cy="50" r="5" fill="#ffffff"/><path d="M 40 78 h 120 v 75 a 16 16 0 0 1 -16 16 h -88 a 16 16 0 0 1 -16 -16 Z"/><rect x="14" y="78" width="18" height="60" rx="9"/><rect x="168" y="78" width="18" height="60" rx="9"/><rect x="66" y="165" width="18" height="40" rx="9"/><rect x="116" y="165" width="18" height="40" rx="9"/></g><text x="100" y="232" font-size="34" font-weight="700" fill="#5f6368" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="3">android</text></svg>`),

  flutter: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75"><polygon points="36,0 0,36 12,48 60,0" fill="#54C5F8"/><polygon points="12,48 36,24 60,48 36,72" fill="#29B6F6"/><polygon points="36,48 60,48 60,72 36,72" fill="#0553B1"/></svg>`)
};

// ── SHADERS ──
const simVS = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const simFS = `
  uniform sampler2D tCurr;
  uniform sampler2D tTarget;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseAmp;
  uniform float uNoiseFreq;
  uniform float uNoiseSpeed;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec4 pos = texture2D(tCurr, vUv);
    vec4 target = texture2D(tTarget, vUv);
    vec3 dir = target.xyz - pos.xyz;
    pos.xyz += dir * uSpeed * (1.0 + target.w * 3.0);
    if (uNoiseAmp > 0.0) {
      float n = snoise(pos.xyz * uNoiseFreq + uTime * uNoiseSpeed);
      pos.x += cos(n * 6.28) * uNoiseAmp * 0.005;
      pos.y += sin(n * 6.28) * uNoiseAmp * 0.005;
      pos.z += sin(n * 3.14) * uNoiseAmp * 0.005;
    }
    gl_FragColor = vec4(pos.xyz, 1.0);
  }
`;

const renderVS = `
  uniform sampler2D tPos;
  uniform sampler2D tColor;
  uniform float uTime;
  uniform float uSize;
  uniform float uIsDark;
  varying vec4 vColor;
  void main() {
    vec4 pos = texture2D(tPos, uv);
    vColor = texture2D(tColor, uv);
    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
    float pulse = 1.0 + sin(uTime * 3.5 + uv.x * 25.0) * 0.15;
    float baseSize = uSize;
    gl_PointSize = (baseSize * pulse) * (3.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const renderFS = `
  varying vec4 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float intensity = pow(1.0 - d * 2.0, 1.0);
    gl_FragColor = vec4(vColor.rgb * 2.2, intensity * vColor.a);
  }
`;

export class LogoParticleEngine {
  constructor(container, logoType, options = {}) {
    if (typeof container === 'string') {
      this.container = document.getElementById(container);
    } else {
      this.container = container;
    }
    if (!this.container) return;

    this.options = options;
    this.isDetail = !!options.isDetail;
    this.isCourses = !!options.isCourses || !!options.isCoursePage;
    this.logoType = logoType || 'react';
    this.sourceData = SVG_DATA_URLS[this.logoType] || SVG_DATA_URLS.react;

    this.size = 128;
    this.totalParticles = this.size * this.size;

    this.targetRotation = new THREE.Vector2();
    this.currentRotation = new THREE.Vector2();
    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isRunning = false;
    this.animId = null;

    this.init();
  }

  init() {
    this.width = this.container.offsetWidth || 280;
    this.height = this.container.offsetHeight || 180;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100);
    this.camera.position.z = 2.4;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.loadAndProcessShape().then(() => {
      this.initFBO();
      this.addEventListeners();
      this.isRunning = true;
      this.animate();
    });
  }

  async loadAndProcessShape() {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.size;
      canvas.height = this.size;

      ctx.clearRect(0, 0, this.size, this.size);

      const processPixels = () => {
        const imageData = ctx.getImageData(0, 0, this.size, this.size);
        const data = imageData.data;

        this.targetData = new Float32Array(this.totalParticles * 4);
        this.colorData = new Float32Array(this.totalParticles * 4);

        const colors = this.getPresetColors();

        const isBg = new Uint8Array(this.size * this.size);
        if (this.logoType === 'cpp' || this.logoType === 'flutter') {
          const size = this.size;
          const visited = new Uint8Array(size * size);
          const queue = [];

          const checkAndAdd = (x, y) => {
            if (x < 0 || x >= size || y < 0 || y >= size) return;
            const idx = y * size + x;
            if (visited[idx]) return;
            visited[idx] = 1;

            const r = data[idx * 4] / 255;
            const g = data[idx * 4 + 1] / 255;
            const b = data[idx * 4 + 2] / 255;
            if (r > 0.90 && g > 0.90 && b > 0.90) {
              isBg[idx] = 1;
              queue.push({ x, y });
            }
          };

          for (let x = 0; x < size; x++) {
            checkAndAdd(x, 0);
            checkAndAdd(x, size - 1);
          }
          for (let y = 1; y < size - 1; y++) {
            checkAndAdd(0, y);
            checkAndAdd(size - 1, y);
          }

          while (queue.length > 0) {
            const curr = queue.shift();
            checkAndAdd(curr.x + 1, curr.y);
            checkAndAdd(curr.x - 1, curr.y);
            checkAndAdd(curr.x, curr.y + 1);
            checkAndAdd(curr.x, curr.y - 1);
          }
        }

        // Pass 1: Find bounding box of active logo pixels
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        const activeIndices = [];

        for (let i = 0; i < this.totalParticles; i++) {
          const r = data[i * 4] / 255;
          const g = data[i * 4 + 1] / 255;
          const b = data[i * 4 + 2] / 255;
          const a = data[i * 4 + 3];

          const px = (i % this.size);
          const py = Math.floor(i / this.size);

          const isWhite = (r > 0.90 && g > 0.90 && b > 0.90);
          const isActive = (this.logoType === 'mobile' || this.logoType === 'meta')
            ? (a > 30 && !isWhite)
            : ((this.logoType === 'cpp' || this.logoType === 'flutter')
              ? (a > 30 && isBg[i] === 0)
              : (a > 30));

          if (isActive) {
            activeIndices.push({ i, px, py, r, g, b, a });
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
          }
        }

        this.activeIndices = activeIndices;

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const widthX = (maxX - minX) || 1;
        const heightY = (maxY - minY) || 1;
        const maxDim = Math.max(widthX, heightY);

        // Pass 2: Set targetData & colorData with normalized scale (2.35 units)
        const targetScale = 2.35;
        const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');
        this.lastIsDark = isDark;

        for (let i = 0; i < this.totalParticles; i++) {
          this.targetData[i * 4 + 3] = 0.0;
        }

        activeIndices.forEach(({ i, px, py, r, g, b, a }) => {
          const normX = ((px - centerX) / maxDim) * targetScale;
          const normY = ((centerY - py) / maxDim) * targetScale;

          this.targetData[i * 4] = normX;
          this.targetData[i * 4 + 1] = normY;
          this.targetData[i * 4 + 2] = (Math.random() - 0.5) * 0.05;
          this.targetData[i * 4 + 3] = a / 255;

          const color = this.getColorForPixel(r, g, b, colors);
          this.colorData[i * 4] = color.r;
          this.colorData[i * 4 + 1] = color.g;
          this.colorData[i * 4 + 2] = color.b;
          this.colorData[i * 4 + 3] = 1.0;
        });

        // Inactive background particles
        for (let i = 0; i < this.totalParticles; i++) {
          if (this.targetData[i * 4 + 3] === 0.0) {
            const radius = 2.5 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            this.targetData[i * 4] = radius * Math.sin(phi) * Math.cos(theta);
            this.targetData[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            this.targetData[i * 4 + 2] = radius * Math.cos(phi);

            this.colorData[i * 4] = 0.0;
            this.colorData[i * 4 + 1] = 0.0;
            this.colorData[i * 4 + 2] = 0.0;
            this.colorData[i * 4 + 3] = 0.0;
          }
        }

        this.targetTexture = new THREE.DataTexture(this.targetData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        this.colorTexture = new THREE.DataTexture(this.colorData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        this.targetTexture.needsUpdate = true;
        this.colorTexture.needsUpdate = true;
        resolve();
      };

      const aspectRatios = {
        react: 23 / 20.46,
        figma: 200 / 300,
        python: 1.0,
        linux: 300 / 150,
        meta: 300 / 200,
        cpp: 1.0,
        aws: 304 / 182,
        mobile: 200 / 240,
        flutter: 60 / 75
      };

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.sourceData;
      img.onload = () => {
        const ar = aspectRatios[this.logoType] || 1.0;
        const margin = 12;
        const maxDim = this.size - margin * 2;
        let drawW = maxDim;
        let drawH = maxDim;
        let drawX = margin;
        let drawY = margin;

        if (ar > 1.0) {
          drawH = maxDim / ar;
          drawY = margin + (maxDim - drawH) / 2;
        } else if (ar < 1.0) {
          drawW = maxDim * ar;
          drawX = margin + (maxDim - drawW) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        processPixels();
      };
    });
  }

  getColorForPixel(r, g, b, colors) {
    const isWhiteDetail = (r > 0.90 && g > 0.90 && b > 0.90);
    const isSecondary = (r > 0.70 || g > 0.70 || b > 0.70);

    let color;
    if (isWhiteDetail) {
      color = colors.eye.clone();
    } else if (isSecondary) {
      color = colors.accent.clone().multiplyScalar(1.0 + (Math.random() - 0.5) * 0.12);
    } else {
      color = colors.primary.clone().multiplyScalar(1.0 + (Math.random() - 0.5) * 0.12);
    }
    return color;
  }

  getPresetColors(isDarkOverride) {
    const isDark = isDarkOverride !== undefined
      ? isDarkOverride
      : (document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark'));
    if (this.isCourses) {
      return {
        primary: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#080808'),
        accent: isDark ? new THREE.Color('#f1f5f9') : new THREE.Color('#242424'),
        eye: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#000000'),
        ambientCloud: [new THREE.Color(0, 0, 0)]
      };
    }
    if (this.isDetail) {
      return {
        primary: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#000a26'),
        accent: isDark ? new THREE.Color('#38bdf8') : new THREE.Color('#002299'),
        eye: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#000414'),
        ambientCloud: [new THREE.Color(0, 0, 0)]
      };
    }
    return {
      primary: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#001a4d'),
      accent: isDark ? new THREE.Color('#38bdf8') : new THREE.Color('#0033aa'),
      eye: isDark ? new THREE.Color('#ffffff') : new THREE.Color('#001133'),
      ambientCloud: [new THREE.Color(0, 0, 0)]
    };
  }

  updateParticleColors(isDark) {
    if (!this.colorData || !this.activeIndices) return;
    const colors = this.getPresetColors(isDark);
    this.activeIndices.forEach(({ i, r, g, b }) => {
      const color = this.getColorForPixel(r, g, b, colors);
      this.colorData[i * 4] = color.r;
      this.colorData[i * 4 + 1] = color.g;
      this.colorData[i * 4 + 2] = color.b;
      this.colorData[i * 4 + 3] = 1.0;
    });
    if (this.colorTexture) {
      this.colorTexture.needsUpdate = true;
    }
  }

  initFBO() {
    this.rtA = new THREE.WebGLRenderTarget(this.size, this.size, {
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });
    this.rtB = this.rtA.clone();

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tCurr: { value: null },
        tTarget: { value: this.targetTexture },
        uTime: { value: 0 },
        uSpeed: { value: 0.015 },
        uNoiseAmp: { value: 0.0 },
        uNoiseFreq: { value: 1.2 },
        uNoiseSpeed: { value: 0.1 }
      },
      vertexShader: simVS,
      fragmentShader: simFS
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.simScene.add(plane);

    this.renderer.setRenderTarget(this.rtA);
    const primeMat = new THREE.MeshBasicMaterial({ map: this.targetTexture });
    const primeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), primeMat);
    this.renderer.render(primeMesh, this.simCamera);
    this.renderer.setRenderTarget(null);

    const geometry = new THREE.BufferGeometry();
    const uvs = new Float32Array(this.totalParticles * 2);
    for (let i = 0; i < this.totalParticles; i++) {
      uvs[i * 2] = (i % this.size) / this.size;
      uvs[i * 2 + 1] = Math.floor(i / this.size) / this.size;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.totalParticles * 3), 3));

    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');

    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tPos: { value: null },
        tColor: { value: this.colorTexture },
        uTime: { value: 0 },
        uSize: { value: this.isDetail ? 5.4 : 3.8 },
        uIsDark: { value: isDark ? 1.0 : 0.0 }
      },
      vertexShader: renderVS,
      fragmentShader: renderFS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.points);
  }

  addEventListeners() {
    this.resizeHandler = () => {
      if (!this.container) return;
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      if (this.width > 0 && this.height > 0) {
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', this.resizeHandler);

    const onMove = (clientX, clientY) => {
      if (this.isMouseDown) {
        const dx = clientX - this.lastMouseX;
        const dy = clientY - this.lastMouseY;
        this.targetRotation.y += dx * 0.007;
        this.targetRotation.x += dy * 0.007;
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
      }
    };

    this.container.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.container.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isMouseDown = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => this.isMouseDown = false);
    this.container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  animate() {
    if (!this.isRunning) return;

    this.animId = requestAnimationFrame(() => this.animate());

    const uTime = performance.now() * 0.001;

    this.simMaterial.uniforms.uTime.value = uTime;
    this.simMaterial.uniforms.tCurr.value = this.rtA.texture;

    this.renderer.setRenderTarget(this.rtB);
    this.renderer.render(this.simScene, this.simCamera);

    const tmp = this.rtA; this.rtA = this.rtB; this.rtB = tmp;

    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');
    if (this.lastIsDark !== isDark) {
      this.lastIsDark = isDark;
      this.updateParticleColors(isDark);
    }

    this.particleMaterial.uniforms.tPos.value = this.rtA.texture;
    this.particleMaterial.uniforms.uTime.value = uTime;
    this.particleMaterial.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    // Gentle 3D floating tilt animation (keeps front-facing logo 100% readable)
    const swayY = Math.sin(uTime * 1.2) * 0.32;
    const swayX = Math.cos(uTime * 0.9) * 0.10;

    this.points.rotation.x = this.currentRotation.x + swayX;
    this.points.rotation.y = this.currentRotation.y + swayY;

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
    }
  }
}

/* =========================================================
   META PARTICLE ENGINE (EXACT 3D GPGPU SIMULATION FROM META ANIMATION PAGE)
========================================================= */

const META_PNG_DATA_URI = "data:image/png;base64,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";

export class MetaParticleEngine {
  constructor(container, options = {}) {
    if (typeof container === 'string') {
      this.container = document.getElementById(container);
    } else {
      this.container = container;
    }
    if (!this.container) return;

    this.options = options;
    this.size = 128;
    this.totalParticles = this.size * this.size;

    this.targetRotation = new THREE.Vector2();
    this.currentRotation = new THREE.Vector2();
    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isRunning = false;
    this.animId = null;

    this.init();
  }

  init() {
    this.width = this.container.offsetWidth || 300;
    this.height = this.container.offsetHeight || 200;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100);
    this.camera.position.z = 2.15;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    this.loadMetaLogo().then(() => {
      this.initFBO();
      this.addEventListeners();
      this.isRunning = true;
      this.animate();
    });
  }

  async loadMetaLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = this.size;
        c.height = this.size;

        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, this.size, this.size);

        const margin = 10;
        const box = this.size - margin * 2;
        const scale = Math.min(box / img.naturalWidth, box / img.naturalHeight);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (this.size - drawW) * 0.5;
        const drawY = (this.size - drawH) * 0.5;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        const pixels = ctx.getImageData(0, 0, this.size, this.size).data;
        this.targetData = new Float32Array(this.totalParticles * 4);
        this.colorData = new Float32Array(this.totalParticles * 4);

        for (let i = 0; i < this.totalParticles; i++) {
          const r = pixels[i * 4 + 0] / 255;
          const g = pixels[i * 4 + 1] / 255;
          const b = pixels[i * 4 + 2] / 255;
          const a = pixels[i * 4 + 3];

          const x = ((i % this.size) / this.size - 0.5) * 2.0;
          const y = (0.5 - Math.floor(i / this.size) / this.size) * 2.0;

          const nearWhite = r > 0.90 && g > 0.90 && b > 0.90;
          const active = a > 30 && !nearWhite;

          if (active) {
            this.targetData[i * 4 + 0] = x * 1.3;
            this.targetData[i * 4 + 1] = y * 1.3;
            this.targetData[i * 4 + 2] = (Math.random() - 0.5) * 0.05;
            this.targetData[i * 4 + 3] = a / 255;
          } else {
            const radius = 2.5 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            this.targetData[i * 4 + 0] = radius * Math.sin(phi) * Math.cos(theta);
            this.targetData[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            this.targetData[i * 4 + 2] = radius * Math.cos(phi);
            this.targetData[i * 4 + 3] = 0.0;
          }
        }

        this.targetTexture = new THREE.DataTexture(
          this.targetData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType
        );
        this.colorTexture = new THREE.DataTexture(
          this.colorData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType
        );

        this.targetTexture.minFilter = this.targetTexture.magFilter = THREE.NearestFilter;
        this.colorTexture.minFilter = this.colorTexture.magFilter = THREE.NearestFilter;

        const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');
        this.lastIsDark = isDark;
        this.updateParticleColors(isDark);

        this.targetTexture.needsUpdate = true;
        this.colorTexture.needsUpdate = true;

        resolve();
      };
      img.src = META_PNG_DATA_URI;
    });
  }

  initFBO() {
    const rtOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this.rtA = new THREE.WebGLRenderTarget(this.size, this.size, rtOptions);
    this.rtB = new THREE.WebGLRenderTarget(this.size, this.size, rtOptions);

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.simMaterial = new THREE.ShaderMaterial({
      vertexShader: simVS,
      fragmentShader: simFS,
      uniforms: {
        tCurr: { value: null },
        tTarget: { value: this.targetTexture },
        uTime: { value: 0 },
        uSpeed: { value: 0.015 },
        uNoiseAmp: { value: 0.0 },
        uNoiseFreq: { value: 1.2 },
        uNoiseSpeed: { value: 0.1 }
      }
    });

    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.simScene.add(simQuad);

    // Prime rtA with initial target texture
    this.renderer.setRenderTarget(this.rtA);
    const primeMat = new THREE.MeshBasicMaterial({ map: this.targetTexture });
    const primeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), primeMat);
    this.renderer.render(primeMesh, this.simCamera);
    this.renderer.setRenderTarget(null);
    primeMat.dispose();
    primeMesh.geometry.dispose();

    const geometry = new THREE.BufferGeometry();
    const uvs = new Float32Array(this.totalParticles * 2);
    const positions = new Float32Array(this.totalParticles * 3);

    for (let i = 0; i < this.totalParticles; i++) {
      uvs[i * 2 + 0] = (i % this.size) / this.size;
      uvs[i * 2 + 1] = Math.floor(i / this.size) / this.size;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    this.particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: renderVS,
      fragmentShader: renderFS,
      uniforms: {
        tPos: { value: null },
        tColor: { value: this.colorTexture },
        uTime: { value: 0 },
        uSize: { value: 3.5 },
        uIsDark: { value: 1.0 }
      }
    });

    this.points = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.points);
  }

  updateParticleColors(isDark) {
    if (!this.colorData || !this.colorTexture) return;
    const count = this.totalParticles;
    for (let i = 0; i < count; i++) {
      const shimmer = 1.0 + (Math.random() - 0.5) * 0.20;
      if (this.targetData[i * 4 + 3] > 0) {
        if (this.options.isCourses) {
          // Sharp dark black (#080808) matching Kali Linux in Light Mode, white in Dark Mode
          const cVal = isDark ? 1.0 : 0.05;
          this.colorData[i * 4 + 0] = Math.min(1.0, cVal * shimmer);
          this.colorData[i * 4 + 1] = Math.min(1.0, cVal * shimmer);
          this.colorData[i * 4 + 2] = Math.min(1.0, cVal * shimmer);
          this.colorData[i * 4 + 3] = 1.0;
        } else {
          // Match all other 3D particle logos on detail page hero (Deep Navy Blue in Light Mode, White/Sky Blue in Dark Mode)
          if (isDark) {
            this.colorData[i * 4 + 0] = Math.min(1.0, 0.85 * shimmer);
            this.colorData[i * 4 + 1] = Math.min(1.0, 0.92 * shimmer);
            this.colorData[i * 4 + 2] = Math.min(1.0, 1.0 * shimmer);
            this.colorData[i * 4 + 3] = 1.0;
          } else {
            this.colorData[i * 4 + 0] = Math.min(1.0, 0.0 * shimmer);
            this.colorData[i * 4 + 1] = Math.min(1.0, 0.06 * shimmer);
            this.colorData[i * 4 + 2] = Math.min(1.0, 0.25 * shimmer);
            this.colorData[i * 4 + 3] = 1.0;
          }
        }
      } else {
        if (isDark) {
          this.colorData[i * 4 + 0] = 0.02;
          this.colorData[i * 4 + 1] = 0.15;
          this.colorData[i * 4 + 2] = 0.40;
          this.colorData[i * 4 + 3] = 0.04;
        } else {
          this.colorData[i * 4 + 0] = 0.0;
          this.colorData[i * 4 + 1] = 0.20;
          this.colorData[i * 4 + 2] = 0.50;
          this.colorData[i * 4 + 3] = 0.05;
        }
      }
    }
    this.colorTexture.needsUpdate = true;
  }

  addEventListeners() {
    this.resizeHandler = () => {
      if (!this.container) return;
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      if (this.width > 0 && this.height > 0) {
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', this.resizeHandler);

    const move = (clientX, clientY) => {
      if (!this.isMouseDown) return;
      const dx = clientX - this.lastMouseX;
      const dy = clientY - this.lastMouseY;
      this.targetRotation.y += dx * 0.007;
      this.targetRotation.x += dy * 0.007;
      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
    };

    this.container.addEventListener('pointerdown', e => {
      this.isMouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('pointerup', () => this.isMouseDown = false);

    this.container.addEventListener('pointermove', e => {
      move(e.clientX, e.clientY);
    });
  }

  animate() {
    if (!this.isRunning) return;
    this.animId = requestAnimationFrame(() => this.animate());

    const uTime = performance.now() * 0.001;

    this.simMaterial.uniforms.uTime.value = uTime;
    this.simMaterial.uniforms.tCurr.value = this.rtA.texture;
    this.simMaterial.uniforms.tTarget.value = this.targetTexture;

    this.renderer.setRenderTarget(this.rtB);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    const temp = this.rtA;
    this.rtA = this.rtB;
    this.rtB = temp;

    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');
    if (this.lastIsDark !== isDark) {
      this.lastIsDark = isDark;
      this.updateParticleColors(isDark);
    }

    this.particleMaterial.uniforms.tPos.value = this.rtA.texture;
    this.particleMaterial.uniforms.uTime.value = uTime;
    this.particleMaterial.uniforms.uSize.value = 3.5;
    this.particleMaterial.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    this.points.rotation.x = this.currentRotation.x;
    this.points.rotation.y = this.currentRotation.y + uTime * 0.04;

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.rtA) this.rtA.dispose();
    if (this.rtB) this.rtB.dispose();
    if (this.targetTexture) this.targetTexture.dispose();
    if (this.colorTexture) this.colorTexture.dispose();
    if (this.renderer) this.renderer.dispose();
    if (this.renderer?.domElement) this.renderer.domElement.remove();
  }
}

