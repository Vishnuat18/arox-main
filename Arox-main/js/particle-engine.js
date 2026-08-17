import * as THREE from 'three';

// ── SVG DATA URLS FOR ALL 9 LOGOS ──
const SVG_DATA_URLS = {
  react: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`),

  figma: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><path fill="#0acf83" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"/><path fill="#a259ff" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"/><path fill="#f24e1e" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"/><path fill="#ff7262" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"/><path fill="#1abcfe" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"/></svg>`),

  python: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.21 -0.077 110 110"><linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="63.8" y1="56.6" x2="118.4" y2="1.8" gradientTransform="matrix(1 0 0 -1 -53.2 66.4)"><stop offset="0" stop-color="#387EB8"/><stop offset="1" stop-color="#366994"/></linearGradient><path fill="url(#g1)" d="M55.023-0.077c-25.971,0-26.25,10.081-26.25,12.156c0,3.148,0,12.594,0,12.594h26.75v3.781c0,0-27.852,0-37.375,0c-7.949,0-17.938,4.833-17.938,26.25c0,19.673,7.792,27.281,15.656,27.281c2.335,0,9.344,0,9.344,0s0-9.765,0-13.125c0-5.491,2.721-15.656,15.406-15.656c15.91,0,19.971,0,26.531,0c3.902,0,14.906-1.696,14.906-14.406c0-13.452,0-17.89,0-24.219C82.054,11.426,81.515-0.077,55.023-0.077z M40.273,8.392c2.662,0,4.813,2.15,4.813,4.813c0,2.661-2.151,4.813-4.813,4.813s-4.813-2.151-4.813-4.813C35.46,10.542,37.611,8.392,40.273,8.392z"/><linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="97" y1="21.6" x2="155.6" y2="-34.5" gradientTransform="matrix(1 0 0 -1 -53.2 66.4)"><stop offset="0" stop-color="#FFE052"/><stop offset="1" stop-color="#FFC331"/></linearGradient><path fill="url(#g2)" d="M55.397,109.923c25.959,0,26.282-10.271,26.282-12.156c0-3.148,0-12.594,0-12.594H54.897v-3.781c0,0,28.032,0,37.375,0c8.009,0,17.938-4.954,17.938-26.25c0-23.322-10.538-27.281-15.656-27.281c-2.336,0-9.344,0-9.344,0s0,10.216,0,13.125c0,5.491-2.631,15.656-15.406,15.656c-15.91,0-19.476,0-26.532,0c-3.892,0-14.906,1.896-14.906,14.406c0,14.475,0,18.265,0,24.219C28.366,100.497,31.562,109.923,55.397,109.923z M70.148,101.454c-2.662,0-4.813-2.151-4.813-4.813s2.15-4.813,4.813-4.813c2.661,0,4.813,2.151,4.813,4.813S72.809,101.454,70.148,101.454z"/></svg>`),

  linux: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><rect x="15" y="15" width="270" height="120" rx="14" fill="none" stroke="#2563eb" stroke-width="12"/><text x="45" y="102" font-size="76" font-weight="800" fill="#2563eb" font-family="Arial, sans-serif" letter-spacing="4">KALI</text></svg>`),

  googleads: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path d="M72.2 4.4L18.6 97.2c-2.4 4.1.6 9.3 5.4 9.3h107.2c4.8 0 7.8-5.2 5.4-9.3L83 4.4c-2.4-4.2-8.4-4.2-10.8 0z" fill="#f9ab00"/><path d="M83 4.4L29.4 97.2c-2.4 4.1.6 9.3 5.4 9.3h53.6c4.8 0 7.8-5.2 5.4-9.3L83 4.4c-2.4-4.2-8.4-4.2-10.8 0z" fill="#1a73e8"/><circle cx="29.4" cy="97.2" r="21.4" fill="#34a853"/></svg>`),

  cpp: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><polygon points="64,4 112,30 112,82 64,108 16,82 16,30" fill="#659BD3"/><polygon points="64,4 112,30 112,82 64,108" fill="#004482"/><text x="30" y="80" font-size="52" font-weight="bold" fill="white" font-family="Arial">C</text><text x="72" y="70" font-size="30" font-weight="bold" fill="white" font-family="Arial">++</text></svg>`),

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
    float baseSize = uSize * (uIsDark < 0.5 ? 0.75 : 1.0);
    gl_PointSize = (baseSize * pulse) * (3.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const renderFS = `
  varying vec4 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float intensity = pow(1.0 - d * 2.0, 1.25);
    gl_FragColor = vec4(vColor.rgb * 1.5, intensity * vColor.a);
  }
`;

export class LogoParticleEngine {
  constructor(container, logoType) {
    if (typeof container === 'string') {
      this.container = document.getElementById(container);
    } else {
      this.container = container;
    }
    if (!this.container) return;

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
        if (this.logoType === 'cpp' || this.logoType === 'googleads' || this.logoType === 'flutter') {
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
          const isActive = (this.logoType === 'mobile')
            ? (a > 30 && !isWhite)
            : ((this.logoType === 'cpp' || this.logoType === 'googleads' || this.logoType === 'flutter')
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

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const widthX = (maxX - minX) || 1;
        const heightY = (maxY - minY) || 1;
        const maxDim = Math.max(widthX, heightY);

        // Pass 2: Set targetData & colorData with normalized scale (1.45 units)
        const targetScale = 1.45;

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

            const cloudColor = colors.ambientCloud[Math.floor(Math.random() * colors.ambientCloud.length)];
            this.colorData[i * 4] = cloudColor.r;
            this.colorData[i * 4 + 1] = cloudColor.g;
            this.colorData[i * 4 + 2] = cloudColor.b;
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
        googleads: 1.0,
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
    let color = new THREE.Color('#ffffff');
    if (this.logoType === 'python') {
      const isEye = (r > 0.95 && g > 0.95 && b > 0.95);
      if (isEye) {
        color = colors.eye;
      } else if (b > r) {
        color = colors.pythonBlue.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      } else {
        color = colors.pythonYellow.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      }
    } else if (this.logoType === 'react') {
      color = colors.reactCyan.clone().multiplyScalar(1.0 + Math.random() * 0.2);
    } else if (this.logoType === 'figma') {
      if (g > 0.6 && r < 0.2) {
        color = colors.figmaGreen.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else if (b > 0.8 && r < 0.2) {
        color = colors.figmaBlue.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else if (r > 0.3 && b > 0.8) {
        color = colors.figmaPurple.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else if (r > 0.8 && g > 0.4 && g < 0.6) {
        color = colors.figmaPink.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else {
        color = colors.figmaOrange.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      }
    } else if (this.logoType === 'aws') {
      if (r > 0.8 && g > 0.5 && b < 0.2) {
        color = colors.awsOrange.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else {
        color = colors.awsWhite.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      }
    } else if (this.logoType === 'mobile') {
      const isGreen = (g > 0.5 && r < 0.75);
      const isWhite = (r > 0.9 && g > 0.9 && b > 0.9);
      if (isWhite) {
        color = colors.eye;
      } else if (isGreen) {
        color = colors.mobileGreen.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else {
        color = colors.mobileBody.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      }
    } else if (this.logoType === 'flutter') {
      if (r > 0.18 && g > 0.5 && b > 0.7) {
        color = colors.cppLight.clone().multiplyScalar(1.0 + Math.random() * 0.3);
      } else if (r > 0.04 && g > 0.35 && b > 0.5) {
        color = colors.cppBlue.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else if (g < 0.45 && b > 0.4) {
        color = colors.cppDark.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else {
        const pick = Math.random();
        if (pick < 0.4) color = colors.cppLight.clone().multiplyScalar(0.8 + Math.random() * 0.4);
        else if (pick < 0.7) color = colors.cppBlue.clone().multiplyScalar(0.8 + Math.random() * 0.3);
        else color = colors.cppDark.clone().multiplyScalar(0.85 + Math.random() * 0.25);
      }
    } else if (this.logoType === 'cpp') {
      const isWhitish = (r > 0.82 && g > 0.82 && b > 0.82);
      if (isWhitish) {
        color = colors.cppLight.clone().multiplyScalar(1.1 + Math.random() * 0.3);
      } else if (r < 0.25 && g < 0.45 && b > 0.45) {
        color = colors.cppDark.clone().multiplyScalar(1.0 + Math.random() * 0.2);
      } else if (b > 0.5 && g > 0.4) {
        color = colors.cppBlue.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      } else {
        const pick = Math.random();
        if (pick < 0.4) color = colors.cppLight.clone().multiplyScalar(0.9 + Math.random() * 0.35);
        else if (pick < 0.7) color = colors.cppBlue.clone().multiplyScalar(0.85 + Math.random() * 0.3);
        else color = colors.cppDark.clone().multiplyScalar(0.85 + Math.random() * 0.25);
      }
    } else if (this.logoType === 'linux') {
      const isWhite = (r > 0.75 && g > 0.75 && b > 0.75);
      if (isWhite) {
        color = colors.linuxWhite.clone().multiplyScalar(1.2 + Math.random() * 0.3);
      } else {
        color = colors.linuxBlack.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      }
    } else if (this.logoType === 'googleads') {
      const isYellow = (r > 0.7 && g > 0.5 && b < 0.3);
      const isGreen = (g > 0.5 && r < 0.4 && b < 0.4);
      const isBlue = (b > 0.5 && r < 0.4);
      if (isYellow) {
        color = colors.googleadsYellow.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      } else if (isGreen) {
        color = colors.googleadsGreen.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      } else if (isBlue) {
        color = colors.googleadsBlue.clone().multiplyScalar(1.0 + Math.random() * 0.25);
      } else {
        const pick = Math.random();
        if (pick < 0.5) color = colors.googleadsBlue.clone().multiplyScalar(0.9 + Math.random() * 0.2);
        else if (pick < 0.8) color = colors.googleadsYellow.clone().multiplyScalar(0.9 + Math.random() * 0.2);
        else color = colors.googleadsGreen.clone().multiplyScalar(0.9 + Math.random() * 0.2);
      }
    }
    return color;
  }

  getPresetColors() {
    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className.includes('dark');
    return {
      pythonBlue: new THREE.Color(isDark ? '#3b82f6' : '#306998'),
      pythonYellow: new THREE.Color(isDark ? '#fbbf24' : '#ffd43b'),
      reactCyan: new THREE.Color('#61dafb'),
      figmaOrange: new THREE.Color('#f24e1e'),
      figmaPink: new THREE.Color('#ff7262'),
      figmaPurple: new THREE.Color('#a259ff'),
      figmaBlue: new THREE.Color('#1abcfe'),
      figmaGreen: new THREE.Color('#0acf83'),
      awsOrange: new THREE.Color('#FF9900'),
      awsWhite: new THREE.Color('#ffffff'),
      flutterCyan: new THREE.Color('#54C5F8'),
      flutterMid: new THREE.Color('#29B6F6'),
      flutterBlue: new THREE.Color('#0553B1'),
      flutterBody: new THREE.Color(isDark ? '#54C5F8' : '#0553B1'),
      cppLight: new THREE.Color('#659BD3'),
      cppBlue: new THREE.Color('#2C79C1'),
      cppDark: new THREE.Color('#004482'),
      linuxYellow: new THREE.Color('#2b7af7'),
      linuxBlack: new THREE.Color('#2b7af7'),
      linuxWhite: new THREE.Color('#ffffff'),
      mobileGreen: new THREE.Color('#a4c639'),
      mobileBody: new THREE.Color(isDark ? '#aaaaaa' : '#5f6368'),
      googleadsBlue: new THREE.Color('#1a73e8'),
      googleadsYellow: new THREE.Color('#f9ab00'),
      googleadsGreen: new THREE.Color('#34a853'),
      eye: new THREE.Color('#ffffff'),
      ambientCloud: [new THREE.Color('#1e3a8a'), new THREE.Color('#4c1d95')]
    };
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
        uSize: { value: 2.5 },
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
