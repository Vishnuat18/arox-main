# Particle Animations — Exact AI Prompt

> This file contains a **single self-contained AI prompt** that reproduces **every particle animation** from [`grid_animations.html`](file:///c:/Users/Lenovo/Downloads/Coffeecrews-main/Coffeecrews-main/grid_animations.html) exactly — including the GPGPU pipeline, all GLSL shaders, color logic per logo, BFS background removal, spin speeds, disperse/align, and all 6 color presets.

---

## 🤖 Copy-Paste Prompt (Particle Animations Only)

```text
Build a GPGPU WebGL 3D particle logo animation system using Three.js v0.160.0 (loaded via ESM importmap).
The system must display 9 particle engines side-by-side in a 3×3 grid.
Each engine independently animates 16,384 particles (128×128 FBO texture) into the shape of a logo.
Implement every detail below exactly.

─────────────────────────────────────────────
SECTION 1 — PARTICLE COUNT & FBO SETUP
─────────────────────────────────────────────
• Texture size: 128 × 128 → 16,384 particles per engine.
• Use dual FloatType render targets (rtA and rtB) for GPU ping-pong position updates.
• Both render targets: THREE.FloatType, THREE.NearestFilter min+mag, THREE.RGBAFormat.
• rtB is a clone of rtA.
• Simulation scene uses THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) and a 2×2 PlaneGeometry quad.
• Main render scene uses PerspectiveCamera(60, aspect, 0.1, 100) with camera.position.z = 2.5.
• Renderer: antialias: true, alpha: true, setClearColor(0x000000, 0), pixelRatio capped at 2.

─────────────────────────────────────────────
SECTION 2 — SIMULATION VERTEX SHADER (simVS)
─────────────────────────────────────────────
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

─────────────────────────────────────────────
SECTION 3 — SIMULATION FRAGMENT SHADER (simFS) — EXACT GLSL
─────────────────────────────────────────────
uniform sampler2D tCurr;
uniform sampler2D tTarget;
uniform float uTime;
uniform float uSpeed;
uniform float uNoiseAmp;
uniform float uNoiseFreq;    // fixed value: 1.2
uniform float uNoiseSpeed;   // fixed value: 0.1

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
    vec4 pos    = texture2D(tCurr,   vUv);
    vec4 target = texture2D(tTarget, vUv);

    // Attraction to logo target
    vec3 dir = target.xyz - pos.xyz;
    pos.xyz += dir * uSpeed * (1.0 + target.w * 3.0);

    // Simplex noise turbulence
    if (uNoiseAmp > 0.0) {
        float n = snoise(pos.xyz * uNoiseFreq + uTime * uNoiseSpeed);
        pos.x += cos(n * 6.28) * uNoiseAmp * 0.005;
        pos.y += sin(n * 6.28) * uNoiseAmp * 0.005;
        pos.z += sin(n * 3.14) * uNoiseAmp * 0.005;
    }

    gl_FragColor = vec4(pos.xyz, 1.0);
}

─────────────────────────────────────────────
SECTION 4 — PARTICLE RENDER VERTEX SHADER (EXACT GLSL)
─────────────────────────────────────────────
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
    // Pulsing size wave: amplitude 0.15, frequency uTime*3.5 + uv.x*25.0
    float pulse = 1.0 + sin(uTime * 3.5 + uv.x * 25.0) * 0.15;
    // Light mode uses 75% of the configured size
    float baseSize = uSize * (uIsDark < 0.5 ? 0.75 : 1.0);
    gl_PointSize = (baseSize * pulse) * (3.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}

─────────────────────────────────────────────
SECTION 5 — PARTICLE RENDER FRAGMENT SHADER (EXACT GLSL)
─────────────────────────────────────────────
varying vec4 vColor;

void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;                          // circular clip
    float intensity = pow(1.0 - d * 2.0, 1.25);   // soft glow falloff
    gl_FragColor = vec4(vColor.rgb * 1.5, intensity * vColor.a);
}

Particle material flags: transparent=true, depthWrite=false, blending=THREE.AdditiveBlending.

─────────────────────────────────────────────
SECTION 6 — GEOMETRY & UV MAPPING
─────────────────────────────────────────────
Build a BufferGeometry with 16,384 points.
UV attribute (vec2): for particle i at index i:
    uv.x = (i % 128) / 128
    uv.y = Math.floor(i / 128) / 128
position attribute: zeroed Float32Array(16384 * 3).
Positions are driven entirely by the FBO texture tPos in the vertex shader.

─────────────────────────────────────────────
SECTION 7 — LOGO IMAGE → PARTICLE TARGET POSITIONS
─────────────────────────────────────────────
For each engine:
1. Draw the logo image onto an offscreen 128×128 canvas with 10px margin on each side:
   ctx.drawImage(img, 10, 10, 108, 108)
2. Call ctx.getImageData to read pixel RGBA values.
3. For each pixel i:
   x = ((i % 128) / 128 - 0.5) * 2
   y = (0.5 - Math.floor(i / 128) / 128) * 2

ACTIVE PIXEL RULES per logo type:
   • 'mobile': active if alpha > 30 AND pixel is NOT near-white (r,g,b all > 0.90)
   • 'cpp', 'googleads', 'flutter': active if alpha > 30 AND isBg[i] === 0
     (isBg is computed by BFS — see Section 8)
   • all others: active if alpha > 30

SCALE MULTIPLIERS on x and y target coordinates:
   • 'flutter'               → scale = 2.1
   • 'cpp' and 'googleads'   → scale = 1.7
   • all others              → scale = 1.3

TARGET DATA per pixel i (RGBA floats stored in Float32Array):
   Active pixel:
       targetData[i*4+0] = x * scale
       targetData[i*4+1] = y * scale
       targetData[i*4+2] = (Math.random() - 0.5) * 0.05   // slight Z spread
       targetData[i*4+3] = alpha / 255
   Inactive pixel (becomes ambient background dust cloud):
       radius = 2.5 + Math.random() * 2.0
       theta  = Math.random() * Math.PI * 2
       phi    = Math.acos(2 * Math.random() - 1)
       targetData[i*4+0] = radius * Math.sin(phi) * Math.cos(theta)
       targetData[i*4+1] = radius * Math.sin(phi) * Math.sin(theta)
       targetData[i*4+2] = radius * Math.cos(phi)
       targetData[i*4+3] = 0.0
       Color alpha: 0.08 in dark mode, 0.0 in light mode

─────────────────────────────────────────────
SECTION 8 — BFS BACKGROUND FLOOD FILL (for 'cpp', 'googleads', 'flutter')
─────────────────────────────────────────────
Used to identify and exclude outer white/near-white background pixels.
Threshold: r > 0.90 AND g > 0.90 AND b > 0.90 = background.

Algorithm:
  isBg    = new Uint8Array(128 * 128)
  visited = new Uint8Array(128 * 128)
  queue   = []

  checkAndAdd(x, y):
    if out-of-bounds or already visited → return
    mark visited
    if near-white → mark isBg[idx]=1 and push to queue

  Seed from all 4 image edges (top row, bottom row, left col, right col).
  Process BFS: for each dequeued pixel push its 4 neighbours (left, right, up, down).

─────────────────────────────────────────────
SECTION 9 — PIXEL-TO-COLOR MAPPING PER LOGO TYPE
─────────────────────────────────────────────
All color choices also multiply by a random brightness shimmer.
Use `color.clone().multiplyScalar(1.0 + Math.random() * 0.2~0.3)`.

REACT     → all particles: reactCyan (shimmer ×0.2)
FIGMA     → 5-zone colour split from pixel RGB:
              g>0.6 & r<0.2        → figmaGreen
              b>0.8 & r<0.2        → figmaBlue
              r>0.3 & b>0.8        → figmaPurple
              r>0.8 & 0.4<g<0.6    → figmaPink
              else                 → figmaOrange
PYTHON    → b>r → pythonBlue; else → pythonYellow; near-white → eye (white)
AWS       → r>0.8 & g>0.5 & b<0.2 → awsOrange; else → awsWhite
MOBILE    → g>0.6 & r<0.3 & b<0.5 → mobileGreen; else → mobileBody
FLUTTER   → uses cppLight / cppBlue / cppDark:
              r>0.18 & g>0.5 & b>0.7  → cppLight  (shimmer ×0.3)
              r>0.04 & g>0.35 & b>0.5 → cppBlue   (shimmer ×0.2)
              g<0.45 & b>0.4          → cppDark   (shimmer ×0.2)
              else → random pick 40% cppLight / 30% cppBlue / 30% cppDark
C++       → near-white (r,g,b > 0.82) → cppLight (shimmer ×0.3)
              r<0.25 & g<0.45 & b>0.45 → cppDark
              b>0.5 & g>0.4            → cppBlue
              else → random pick 40/30/30 split
LINUX     → lum<0.25 → linuxBlack; near-white → linuxWhite;
              r>0.7 & g>0.5 & b<0.3 → linuxYellow;
              else → random 45% yellow / 30% black / 25% white
GOOGLEADS → r>0.7 & g>0.5 & b<0.3     → googleadsYellow
              g>0.5 & r<0.4 & b<0.4   → googleadsGreen
              b>0.5 & r<0.4            → googleadsBlue
              else → random 50% blue / 30% yellow / 20% green

─────────────────────────────────────────────
SECTION 10 — DISPERSE & ALIGN FUNCTIONS
─────────────────────────────────────────────
disperse():
  Generate 16,384 random spherical positions:
    radius = 2.0 + Math.random() * 3.5
    theta  = Math.random() * Math.PI * 2
    phi    = Math.acos(2 * Math.random() - 1)
    x = radius * sin(phi) * cos(theta)
    y = radius * sin(phi) * sin(theta)
    z = radius * cos(phi)
  Upload as DataTexture into rtA via a prime render pass.

align():
  Re-prime rtA with the original targetTexture (logo positions).

─────────────────────────────────────────────
SECTION 11 — ANIMATION LOOP & ROTATION
─────────────────────────────────────────────
Each frame (requestAnimationFrame):
  uTime = performance.now() * 0.001

  SIM PASS:
    simMaterial.uniforms.uTime  = uTime
    simMaterial.uniforms.uSpeed = globalSpeed   (from slider, default 0.015)
    simMaterial.uniforms.uNoiseAmp = globalNoise (from slider, default 0.35)
    simMaterial.uniforms.tCurr  = rtA.texture
    Render simScene → rtB
    Swap: [rtA, rtB] = [rtB, rtA]

  RENDER PASS:
    particleMaterial.uniforms.tPos  = rtA.texture
    particleMaterial.uniforms.uTime = uTime
    particleMaterial.uniforms.uSize = globalSize (from slider, default 2.5)
    particleMaterial.uniforms.uIsDark = (dark mode ? 1.0 : 0.0)
    Render to screen.

ROTATION:
  Mouse drag sensitivity: dx/dy * 0.007 added to targetRotation.x/y
  Lerp damping: currentRotation += (target - current) * 0.08 each frame
  points.rotation.x = currentRotation.x
  points.rotation.y = currentRotation.y + uTime * spinOffset

  Per-logo Y-axis spin offsets (uTime multiplier):
    react     → -0.06
    python    →  0.08
    figma     →  0.05  (default)
    aws       → -0.04
    mobile    →  0.05
    flutter   →  0.05
    cpp       → -0.06
    linux     →  0.055
    googleads →  0.04

─────────────────────────────────────────────
SECTION 12 — 6 COLOR THEME PRESETS (EXACT HEX VALUES)
─────────────────────────────────────────────
The preset selector live-updates all color textures without reloading.

PRESET: classic (default)
  reactCyan       #61dafb
  pythonBlue      #3b82f6 (dark) / #306998 (light)
  pythonYellow    #fbbf24 (dark) / #ffd43b (light)
  figmaOrange     #f24e1e
  figmaPink       #ff7262
  figmaPurple     #a259ff
  figmaBlue       #1abcfe
  figmaGreen      #0acf83
  awsOrange       #FF9900
  awsWhite        #ffffff
  flutterCyan     #54C5F8
  flutterMid      #29B6F6
  flutterBlue     #0553B1
  flutterBody     #54C5F8 (dark) / #0553B1 (light)
  cppLight        #659BD3
  cppBlue         #2C79C1
  cppDark         #004482
  linuxYellow     #FFCC00
  linuxBlack      #dddddd (dark) / #222222 (light)
  linuxWhite      #ffffff (dark) / #aaaaaa (light)
  mobileGreen     #3ddc84
  mobileBody      #ffffff (dark) / #101010 (light)
  googleadsBlue   #1a73e8
  googleadsYellow #f9ab00
  googleadsGreen  #34a853
  eye             #ffffff
  ambientCloud    [#1e3a8a, #4c1d95]

PRESET: cyberpunk
  reactCyan       #00f0ff
  pythonBlue      #ff007f
  pythonYellow    #00f0ff
  figmaOrange     #ff007f  figmaPink #ff00ff  figmaPurple #8b5cf6
  figmaBlue       #00f0ff  figmaGreen #00ffcc
  awsOrange       #ffe600  awsWhite  #ff00ff
  mobileGreen     #00ffcc  mobileBody #ff00ff
  cppLight        #00f0ff  cppBlue #ff00cc  cppDark #aa00ff
  linuxYellow     #ffe600  linuxBlack #aa00ff  linuxWhite #00f0ff
  googleadsBlue   #00f0ff  googleadsYellow #ff00ff  googleadsGreen #00ffcc
  eye             #ffffff
  ambientCloud    [#ff0055, #00aaff]

PRESET: matrix
  All logos → shades of green
  reactCyan       #00ff66
  pythonBlue      #00ff66  pythonYellow #003b00
  figmaOrange     #00ff66  figmaPink #00ff33  figmaPurple #004d1a
  figmaBlue       #00b33c  figmaGreen #00e65c
  awsOrange       #00ff66  awsWhite #005500
  mobileGreen     #00ff66  mobileBody #005500
  cppLight        #00ff99  cppBlue #00cc55  cppDark #005500
  linuxYellow     #aaff00  linuxBlack #002200  linuxWhite #00ff66
  googleadsBlue   #00cc55  googleadsYellow #005500  googleadsGreen #00ff66
  ambientCloud    [#002200, #00aa33]

PRESET: fire
  All logos → reds, oranges, yellows
  reactCyan       #ff3c00
  pythonBlue      #ff2200  pythonYellow #ffaa00
  figmaOrange     #ff2200  figmaPink #ff5500  figmaPurple #ff8800
  figmaBlue       #ffaa00  figmaGreen #ffd400
  awsOrange       #ffaa00  awsWhite #ff3c00
  mobileGreen     #ffd400  mobileBody #ff2200
  cppLight        #ffe066  cppBlue #ff9900  cppDark #cc3300
  linuxYellow     #ffdd00  linuxBlack #ff3300  linuxWhite #ff8800
  googleadsBlue   #ff3c00  googleadsYellow #ffaa00  googleadsGreen #ffd400
  ambientCloud    [#330000, #ff5500]

PRESET: aurora
  reactCyan       #22d3ee
  pythonBlue      #a3e635  pythonYellow #7c3aed
  figmaOrange     #a3e635  figmaPink #22d3ee  figmaPurple #7c3aed
  figmaBlue       #4338ca  figmaGreen #05cf83
  awsOrange       #22d3ee  awsWhite #7c3aed
  mobileGreen     #05cf83  mobileBody #7c3aed
  cppLight        #a3e635  cppBlue #22d3ee  cppDark #4338ca
  linuxYellow     #a3e635  linuxBlack #1e1b4b  linuxWhite #22d3ee
  googleadsBlue   #22d3ee  googleadsYellow #7c3aed  googleadsGreen #05cf83
  ambientCloud    [#1e1b4b, #065f46]

PRESET: chrome (monochromatic, theme-aware)
  dark mode: light greys  e.g. #cbd5e1 / #e2e8f0 / #94a3b8 / #64748b
  light mode: dark slates e.g. #475569 / #334155 / #1e293b / #0f172a
  eye (dark): #3b82f6  eye (light): #2563eb
  ambientCloud [#475569, #94a3b8]

─────────────────────────────────────────────
SECTION 13 — SLIDER CONTROL DEFAULTS
─────────────────────────────────────────────
Size       range 0.5–6.0  step 0.1  default 2.5  → drives uSize in particle vertex shader
Speed      range 0.005–0.05  step 0.001  default 0.015  → drives uSpeed in simFS
Turbulence range 0.0–1.5  step 0.05  default 0.35  → drives uNoiseAmp in simFS
uNoiseFreq is fixed at 1.2 (not exposed as a slider).
uNoiseSpeed is fixed at 0.1 (not exposed as a slider).

─────────────────────────────────────────────
SECTION 14 — 9 ENGINE INSTANCES
─────────────────────────────────────────────
Instantiate LogoParticleEngine for each canvas wrapper div:
  canvas-react     logoType='react'
  canvas-figma     logoType='figma'
  canvas-python    logoType='python'
  canvas-aws       logoType='aws'
  canvas-mobile    logoType='mobile'
  canvas-flutter   logoType='flutter'
  canvas-cpp       logoType='cpp'
  canvas-linux     logoType='linux'
  canvas-googleads logoType='googleads'

All 9 engines share the same global slider values read live every animation frame.
Preset color changes re-draw all engines' color textures without rebuilding position data.
```

---

## 📌 Particle Animations At a Glance

| Animation Detail | Exact Value |
| :--- | :--- |
| Particles per engine | **16,384** (128 × 128 FBO) |
| Total active particles | **147,456** (9 engines) |
| GPU method | **Ping-pong Float render targets** (rtA ↔ rtB) |
| Physics update | **GPU Simplex Noise + lerp attraction** (GLSL simFS) |
| Noise frequency | **1.2** (fixed) |
| Noise time scale | **0.1** (fixed) |
| Pulse wave formula | `1.0 + sin(uTime * 3.5 + uv.x * 25.0) * 0.15` |
| Glow falloff formula | `pow(1.0 - d * 2.0, 1.25)` |
| Point blending | **THREE.AdditiveBlending** |
| Rotation damping | **0.08** lerp factor per frame |
| Mouse drag sensitivity | **0.007** per pixel |
| Disperse sphere radius | **2.0 – 5.5** (random) |
| Background cloud radius | **2.5 – 4.5** (random) |
| Background dust alpha | **0.08** (dark) / **0.0** (light) |
| Logo target depth spread | `(Math.random() - 0.5) * 0.05` |
| BFS white threshold | `r > 0.90 && g > 0.90 && b > 0.90` |
| Canvas draw margin | **10px** on each side |
| Speed slider default | **0.015** |
| Turbulence slider default | **0.35** |
| Size slider default | **2.5** |
| Color presets | **6** (Classic, Cyberpunk, Matrix, Fire, Aurora, Chrome) |
