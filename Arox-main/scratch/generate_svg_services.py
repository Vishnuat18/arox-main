import os

output_dir = r"c:\Users\vishn\Desktop\Projects\Arox\Arox-main\assets\services"
os.makedirs(output_dir, exist_ok=True)

# Color System Definitions
PALETTES = {
    "light": {
        "bg": "#FFFFFF",
        "surface": "#F8F9FA",
        "primary": "#155EEF",
        "secondary": "#175cd3",
        "heading": "#0A1B3F",
        "body": "#334766",
        "border": "#D6E0EF",
        "glow": "rgba(21, 94, 239, 0.06)",
        "card_bg": "#FFFFFF",
        "shadow": "rgba(10, 27, 63, 0.06)"
    },
    "dark": {
        "bg": "#0b0c11",
        "surface": "#161822",
        "primary": "#2563eb",
        "secondary": "#3b82f6",
        "heading": "#FFFFFF",
        "body": "#C5D3E8",
        "border": "#1E293B",
        "glow": "rgba(37, 99, 235, 0.12)",
        "card_bg": "#161822",
        "shadow": "rgba(0, 0, 0, 0.4)"
    }
}

# SVG template wrapper
def create_svg(content, mode):
    p = PALETTES[mode]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_{mode}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{p['primary']}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="{p['primary']}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow_{mode}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="{p['heading']}" flood-opacity="{ '0.08' if mode=='light' else '0.4' }"/>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="600" height="800" fill="{p['bg']}"/>
  
  <!-- Subtle Background Grid -->
  <g opacity="{ '0.4' if mode=='light' else '0.25' }" stroke="{p['border']}" stroke-width="1" stroke-dasharray="4 8">
    <line x1="100" y1="0" x2="100" y2="800"/>
    <line x1="200" y1="0" x2="200" y2="800"/>
    <line x1="300" y1="0" x2="300" y2="800"/>
    <line x1="400" y1="0" x2="400" y2="800"/>
    <line x1="500" y1="0" x2="500" y2="800"/>
    <line x1="0" y1="150" x2="600" y2="150"/>
    <line x1="0" y1="300" x2="600" y2="300"/>
    <line x1="0" y1="450" x2="600" y2="450"/>
    <line x1="0" y1="600" x2="600" y2="600"/>
  </g>
  
  <!-- Content Area -->
  {content}
</svg>'''

# 1. Software Development
def svg_software_dev(mode):
    p = PALETTES[mode]
    content = f'''
    <!-- Soft background glow circle -->
    <circle cx="300" cy="400" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Elevated Isometric Card -->
    <g transform="translate(150, 220)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="300" height="360" rx="20" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Card Window Header -->
      <line x1="0" y1="48" x2="300" y2="48" stroke="{p['border']}" stroke-width="1.5"/>
      <circle cx="30" cy="24" r="5" fill="{p['primary']}"/>
      <circle cx="48" cy="24" r="5" fill="{p['border']}"/>
      <circle cx="66" cy="24" r="5" fill="{p['border']}"/>
      
      <!-- Brackets Icon & Code Logic Nodes -->
      <path d="M 90 120 L 60 160 L 60 190 L 40 200 L 60 210 L 60 240 L 90 280" fill="none" stroke="{p['primary']}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 210 120 L 240 160 L 240 190 L 260 200 L 240 210 L 240 240 L 210 280" fill="none" stroke="{p['primary']}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Logic Nodes & Connection Lines -->
      <line x1="100" y1="170" x2="160" y2="170" stroke="{p['border']}" stroke-width="3" stroke-dasharray="4 4"/>
      <line x1="160" y1="170" x2="200" y2="210" stroke="{p['primary']}" stroke-width="3"/>
      <line x1="100" y1="230" x2="180" y2="230" stroke="{p['border']}" stroke-width="3"/>
      
      <circle cx="160" cy="170" r="8" fill="{p['primary']}"/>
      <circle cx="200" cy="210" r="10" fill="{p['primary']}"/>
      <circle cx="100" cy="230" r="7" fill="{p['secondary']}"/>
    </g>
    '''
    return create_svg(content, mode)

# 2. Web Design & Development
def svg_web_dev(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="330" cy="370" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Floating Browser Viewport Offset Right -->
    <g transform="translate(130, 180)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="340" height="420" rx="16" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Window Controls -->
      <rect x="0" y="0" width="340" height="50" rx="16" fill="{p['border']}" opacity="0.3"/>
      <circle cx="25" cy="25" r="5" fill="{p['primary']}"/>
      <circle cx="42" cy="25" r="5" fill="{p['body']}" opacity="0.3"/>
      <circle cx="59" cy="25" r="5" fill="{p['body']}" opacity="0.3"/>
      <rect x="90" y="14" width="180" height="22" rx="6" fill="{p['bg']}" stroke="{p['border']}" stroke-width="1"/>
      
      <!-- Web Globe Icon Badge -->
      <g transform="translate(250, 80)">
        <circle cx="30" cy="30" r="32" fill="{p['primary']}"/>
        <circle cx="30" cy="30" r="22" fill="none" stroke="{p['bg']}" stroke-width="2.5"/>
        <ellipse cx="30" cy="30" rx="10" ry="22" fill="none" stroke="{p['bg']}" stroke-width="2.5"/>
        <line x1="8" y1="30" x2="52" y2="30" stroke="{p['bg']}" stroke-width="2.5"/>
      </g>
      
      <!-- Wireframe Layout Blocks -->
      <rect x="30" y="80" width="200" height="120" rx="10" fill="{p['bg']}" stroke="{p['border']}" stroke-width="2"/>
      <rect x="45" y="100" width="100" height="12" rx="4" fill="{p['primary']}"/>
      <rect x="45" y="125" width="140" height="8" rx="3" fill="{p['body']}" opacity="0.3"/>
      <rect x="45" y="140" width="110" height="8" rx="3" fill="{p['body']}" opacity="0.3"/>
      
      <!-- Responsive Grid Columns -->
      <rect x="30" y="225" width="85" height="150" rx="10" fill="{p['bg']}" stroke="{p['border']}" stroke-width="2"/>
      <rect x="127" y="225" width="85" height="150" rx="10" fill="{p['bg']}" stroke="{p['border']}" stroke-width="2"/>
      <rect x="225" y="225" width="85" height="150" rx="10" fill="{p['primary']}" opacity="0.15" stroke="{p['primary']}" stroke-width="2"/>
    </g>
    '''
    return create_svg(content, mode)

# 3. App Development
def svg_app_dev(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Central Upright Smartphone Silhouette -->
    <g transform="translate(180, 160)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="240" height="480" rx="36" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <!-- Speaker Notch -->
      <rect x="80" y="16" width="80" height="6" rx="3" fill="{p['border']}"/>
      <!-- Screen Bounds -->
      <rect x="14" y="38" width="212" height="404" rx="20" fill="{p['bg']}"/>
      
      <!-- Layered Floating Component Cards -->
      <!-- App Header -->
      <rect x="30" y="60" width="180" height="45" rx="10" fill="{p['surface']}" stroke="{p['border']}" stroke-width="1.5"/>
      <circle cx="55" cy="82" r="12" fill="{p['primary']}"/>
      <rect x="80" y="76" width="90" height="12" rx="4" fill="{p['heading']}"/>
      
      <!-- Central Feature Card -->
      <g transform="translate(-20, 125)" filter="url(#shadow_{mode})">
        <rect x="0" y="0" width="220" height="140" rx="16" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="2"/>
        <circle cx="40" cy="40" r="18" fill="{p['primary']}" opacity="0.2"/>
        <path d="M32 40 L38 46 L50 32" fill="none" stroke="{p['primary']}" stroke-width="3" stroke-linecap="round"/>
        <rect x="70" y="32" width="120" height="14" rx="4" fill="{p['heading']}"/>
        <rect x="70" y="54" width="90" height="10" rx="3" fill="{p['body']}" opacity="0.4"/>
        <!-- Action Button -->
        <rect x="30" y="85" width="160" height="34" rx="8" fill="{p['primary']}"/>
      </g>
      
      <!-- Interactive Touch Nodes -->
      <circle cx="120" cy="320" r="24" fill="{p['primary']}" opacity="0.15"/>
      <circle cx="120" cy="320" r="12" fill="{p['primary']}"/>
      <circle cx="120" cy="415" r="18" fill="none" stroke="{p['border']}" stroke-width="2"/>
    </g>
    '''
    return create_svg(content, mode)

# 4. API Integration
def svg_api_integration(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Diagonal Flow: Microservice 1 (Bottom Left) -->
    <g transform="translate(100, 420)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="180" height="180" rx="20" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      <rect x="25" y="30" width="80" height="12" rx="4" fill="{p['primary']}"/>
      <rect x="25" y="55" width="130" height="8" rx="3" fill="{p['body']}" opacity="0.3"/>
      <rect x="25" y="70" width="100" height="8" rx="3" fill="{p['body']}" opacity="0.3"/>
      <!-- Database lines icon -->
      <ellipse cx="60" cy="125" rx="35" ry="12" fill="none" stroke="{p['primary']}" stroke-width="2.5"/>
      <path d="M25 125 v20 c0 6.6 15.7 12 35 12 s35 -5.4 35 -12 v-20" fill="none" stroke="{p['primary']}" stroke-width="2.5"/>
    </g>
    
    <!-- Diagonal Connecting Data Cable & API Plug Node -->
    <path d="M 250 450 Q 300 400 350 350" fill="none" stroke="{p['primary']}" stroke-width="5" stroke-dasharray="8 6"/>
    
    <!-- Central Glowing API Plug Badge -->
    <g transform="translate(260, 360)" filter="url(#shadow_{mode})">
      <circle cx="40" cy="40" r="38" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <path d="M 28 40 L 40 28 M 40 52 L 52 40" stroke="{p['primary']}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 24 24 L 32 32 M 48 48 L 56 56" stroke="{p['primary']}" stroke-width="4" stroke-linecap="round"/>
    </g>
    
    <!-- Microservice 2 (Top Right) -->
    <g transform="translate(320, 180)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="180" height="180" rx="20" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="2"/>
      <circle cx="40" cy="40" r="16" fill="{p['primary']}"/>
      <rect x="70" y="34" width="80" height="12" rx="4" fill="{p['heading']}"/>
      <!-- Code Tags -->
      <path d="M40 100 L25 115 L40 130 M140 100 L155 115 L140 130" stroke="{p['primary']}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="55" y="110" width="70" height="10" rx="3" fill="{p['body']}" opacity="0.4"/>
    </g>
    '''
    return create_svg(content, mode)

# 5. UI/UX Design
def svg_ui_ux_design(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Curved Bezier Spline & Precision Handles -->
    <g transform="translate(100, 180)" filter="url(#shadow_{mode})">
      <!-- UI Canvas Frame -->
      <rect x="0" y="0" width="400" height="440" rx="24" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Smooth Vector Curve -->
      <path d="M 40 340 C 120 120, 280 400, 360 140" fill="none" stroke="{p['primary']}" stroke-width="4.5"/>
      
      <!-- Control Points & Tangent Lines -->
      <line x1="120" y1="120" x2="220" y2="120" stroke="{p['secondary']}" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="120" cy="120" r="7" fill="{p['bg']}" stroke="{p['primary']}" stroke-width="3"/>
      <circle cx="220" cy="120" r="6" fill="{p['primary']}"/>
      
      <line x1="280" y1="400" x2="180" y2="400" stroke="{p['secondary']}" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="280" cy="400" r="7" fill="{p['bg']}" stroke="{p['primary']}" stroke-width="3"/>
      <circle cx="180" cy="400" r="6" fill="{p['primary']}"/>
      
      <!-- Precision Pen Tool Cursor Icon -->
      <g transform="translate(320, 80)">
        <path d="M 0 0 L 28 35 L 16 35 L 24 55 L 16 58 L 8 38 L 0 45 Z" fill="{p['primary']}" stroke="{p['bg']}" stroke-width="2"/>
      </g>
      
      <!-- Floating Layer Bounding Box -->
      <rect x="50" y="200" width="140" height="90" rx="8" fill="none" stroke="{p['primary']}" stroke-width="2" stroke-dasharray="6 6"/>
      <rect x="45" y="195" width="10" height="10" fill="{p['primary']}"/>
      <rect x="185" y="195" width="10" height="10" fill="{p['primary']}"/>
      <rect x="45" y="285" width="10" height="10" fill="{p['primary']}"/>
      <rect x="185" y="285" width="10" height="10" fill="{p['primary']}"/>
    </g>
    '''
    return create_svg(content, mode)

# 6. Graphic Design
def svg_graphic_design(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="280" cy="420" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Three Overlapping Swatch Cards with Alignment Crosshairs -->
    <!-- Card 1 (Back) -->
    <g transform="translate(120, 200)" opacity="0.7">
      <rect x="0" y="0" width="220" height="300" rx="16" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      <circle cx="110" cy="110" r="50" fill="{p['border']}"/>
    </g>
    
    <!-- Card 2 (Middle Primary Accent) -->
    <g transform="translate(180, 260)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="240" height="320" rx="20" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="2.5"/>
      <rect x="24" y="24" width="192" height="180" rx="12" fill="{p['primary']}"/>
      <!-- Color Code Label Badge -->
      <rect x="24" y="230" width="100" height="14" rx="4" fill="{p['heading']}"/>
      <rect x="24" y="254" width="140" height="10" rx="3" fill="{p['body']}" opacity="0.4"/>
      
      <!-- Precise Ruler Marks -->
      <line x1="216" y1="230" x2="216" y2="280" stroke="{p['border']}" stroke-width="2"/>
      <line x1="206" y1="230" x2="216" y2="230" stroke="{p['border']}" stroke-width="2"/>
      <line x1="210" y1="242" x2="216" y2="242" stroke="{p['border']}" stroke-width="2"/>
      <line x1="206" y1="254" x2="216" y2="254" stroke="{p['border']}" stroke-width="2"/>
      <line x1="210" y1="266" x2="216" y2="266" stroke="{p['border']}" stroke-width="2"/>
      <line x1="206" y1="278" x2="216" y2="278" stroke="{p['border']}" stroke-width="2"/>
    </g>
    
    <!-- Alignment Guide Crosshair Icon -->
    <g transform="translate(130, 480)">
      <circle cx="30" cy="30" r="25" fill="none" stroke="{p['primary']}" stroke-width="2"/>
      <line x1="5" y1="30" x2="55" y2="30" stroke="{p['primary']}" stroke-width="2"/>
      <line x1="30" y1="5" x2="30" y2="55" stroke="{p['primary']}" stroke-width="2"/>
      <circle cx="30" cy="30" r="4" fill="{p['primary']}"/>
    </g>
    '''
    return create_svg(content, mode)

# 7. Branding & Visual Identity
def svg_branding(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Symmetrical Golden-Ratio Construction Axis & Brand Mark Emblem -->
    <g transform="translate(300, 400)">
      <!-- Outer Construction Circles -->
      <circle cx="0" cy="0" r="180" fill="none" stroke="{p['border']}" stroke-width="1.5" stroke-dasharray="6 6"/>
      <circle cx="0" cy="0" r="130" fill="none" stroke="{p['border']}" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="80" fill="none" stroke="{p['primary']}" stroke-width="1" stroke-dasharray="4 4"/>
      
      <!-- Axis Lines -->
      <line x1="-210" y1="0" x2="210" y2="0" stroke="{p['border']}" stroke-width="1"/>
      <line x1="0" y1="-210" x2="0" y2="210" stroke="{p['border']}" stroke-width="1"/>
      <line x1="-150" y1="-150" x2="150" y2="150" stroke="{p['border']}" stroke-width="1" opacity="0.5"/>
      <line x1="-150" y1="150" x2="150" y2="-150" stroke="{p['border']}" stroke-width="1" opacity="0.5"/>
      
      <!-- Sculpted Emblem / Monogram -->
      <g filter="url(#shadow_{mode})">
        <path d="M -60 -60 L 60 -60 L 0 60 Z" fill="none" stroke="{p['primary']}" stroke-width="8" stroke-linejoin="round"/>
        <circle cx="0" cy="-20" r="28" fill="{p['primary']}"/>
        <polygon points="0,-75 22,-30 -22,-30" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="4"/>
      </g>
      
      <!-- Dimension Tick Markers -->
      <circle cx="0" cy="-180" r="5" fill="{p['primary']}"/>
      <circle cx="180" cy="0" r="5" fill="{p['primary']}"/>
      <circle cx="0" cy="180" r="5" fill="{p['primary']}"/>
      <circle cx="-180" cy="0" r="5" fill="{p['primary']}"/>
    </g>
    '''
    return create_svg(content, mode)

# 8. Motion Graphics
def svg_motion_graphics(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Dynamic S-Curve Motion Path Ribbon -->
    <path d="M 100 600 C 120 380, 480 420, 500 200" fill="none" stroke="{p['primary']}" stroke-width="6" stroke-linecap="round"/>
    <!-- Secondary Motion Echo Trace -->
    <path d="M 80 620 C 100 400, 460 440, 480 220" fill="none" stroke="{p['border']}" stroke-width="3" stroke-dasharray="6 8"/>
    
    <!-- Orbiting Particle Trajectory Rings -->
    <ellipse cx="300" cy="400" rx="180" ry="70" fill="none" stroke="{p['primary']}" stroke-width="1.5" stroke-dasharray="4 6" transform="rotate(-25, 300, 400)"/>
    
    <!-- Staggered Diamond Keyframe Nodes -->
    <!-- Keyframe 1 -->
    <g transform="translate(140, 520) rotate(45)" filter="url(#shadow_{mode})">
      <rect x="-16" y="-16" width="32" height="32" rx="6" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
    </g>
    
    <!-- Keyframe 2 (Active Center) -->
    <g transform="translate(300, 400) rotate(45)" filter="url(#shadow_{mode})">
      <rect x="-24" y="-24" width="48" height="48" rx="10" fill="{p['primary']}"/>
      <circle cx="0" cy="0" r="8" fill="{p['bg']}"/>
    </g>
    
    <!-- Keyframe 3 -->
    <g transform="translate(440, 260) rotate(45)" filter="url(#shadow_{mode})">
      <rect x="-16" y="-16" width="32" height="32" rx="6" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
    </g>
    
    <!-- Motion Trail Spark Particles -->
    <circle cx="230" cy="450" r="6" fill="{p['primary']}"/>
    <circle cx="370" cy="340" r="8" fill="{p['secondary']}"/>
    <circle cx="480" cy="220" r="5" fill="{p['primary']}"/>
    '''
    return create_svg(content, mode)

# 9. E-Commerce Solutions
def svg_ecommerce(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="420" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Minimalist Wireframe Shopping Bag Frame -->
    <g transform="translate(160, 220)" filter="url(#shadow_{mode})">
      <rect x="0" y="100" width="280" height="320" rx="24" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2.5"/>
      
      <!-- Bag Handles -->
      <path d="M 80 100 V 50 C 80 20, 200 20, 200 50 V 100" fill="none" stroke="{p['primary']}" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Bag Content Card -->
      <rect x="30" y="140" width="220" height="120" rx="14" fill="{p['bg']}" stroke="{p['border']}" stroke-width="1.5"/>
      <rect x="50" y="165" width="100" height="14" rx="4" fill="{p['heading']}"/>
      <rect x="50" y="190" width="70" height="10" rx="3" fill="{p['body']}" opacity="0.4"/>
      <rect x="180" y="165" width="50" height="20" rx="6" fill="{p['primary']}"/>
      
      <!-- Elevated Verified Payment Checkmark Node -->
      <g transform="translate(180, 260)" filter="url(#shadow_{mode})">
        <circle cx="40" cy="40" r="42" fill="{p['primary']}"/>
        <path d="M 26 40 L 36 50 L 56 30" fill="none" stroke="{p['bg']}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>
    '''
    return create_svg(content, mode)

# 10. Digital Marketing
def svg_digital_marketing(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="320" cy="380" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Ascending Analytics Chart Container -->
    <g transform="translate(120, 200)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="360" height="420" rx="24" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Baseline Axis -->
      <line x1="40" y1="350" x2="320" y2="350" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Ascending Bars -->
      <rect x="60" y="270" width="45" height="80" rx="8" fill="{p['border']}"/>
      <rect x="125" y="220" width="45" height="130" rx="8" fill="{p['border']}"/>
      <rect x="190" y="150" width="45" height="200" rx="8" fill="{p['secondary']}" opacity="0.4"/>
      <rect x="255" y="80" width="45" height="270" rx="8" fill="{p['primary']}"/>
      
      <!-- Upward Trend Line Arrow -->
      <path d="M 80 250 Q 180 180 275 60" fill="none" stroke="{p['primary']}" stroke-width="4" stroke-dasharray="6 6"/>
      
      <!-- Dotted Target Bullseye Cursor Emblem at Peak -->
      <g transform="translate(278, 55)">
        <circle cx="0" cy="0" r="24" fill="none" stroke="{p['primary']}" stroke-width="2"/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="{p['primary']}" stroke-width="2"/>
        <circle cx="0" cy="0" r="5" fill="{p['primary']}"/>
      </g>
    </g>
    '''
    return create_svg(content, mode)

# 11. BPO Services
def svg_bpo_services(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="220" fill="url(#grad_{mode})"/>
    
    <!-- Central Circular Workflow Process Ring -->
    <g transform="translate(300, 400)">
      <!-- Outer Rotating Process Arrows -->
      <circle cx="0" cy="0" r="170" fill="none" stroke="{p['border']}" stroke-width="2"/>
      <path d="M -120 -120 A 170 170 0 0 1 120 -120" fill="none" stroke="{p['primary']}" stroke-width="5" stroke-linecap="round"/>
      <polygon points="125,-130 138,-108 112,-112" fill="{p['primary']}"/>
      
      <path d="M 120 120 A 170 170 0 0 1 -120 120" fill="none" stroke="{p['primary']}" stroke-width="5" stroke-linecap="round"/>
      <polygon points="-125,130 -138,108 -112,112" fill="{p['primary']}"/>
      
      <!-- Inner Support & Communications Badge -->
      <g filter="url(#shadow_{mode})">
        <rect x="-90" y="-90" width="180" height="180" rx="28" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="2.5"/>
        
        <!-- Headset / Support Node Icon -->
        <path d="M -40 0 A 40 40 0 0 1 40 0 V 20 H 30 V 0 A 30 30 0 0 0 -30 0 V 20 H -40 Z" fill="{p['primary']}"/>
        <rect x="-48" y="10" width="16" height="30" rx="6" fill="{p['primary']}"/>
        <rect x="32" y="10" width="16" height="30" rx="6" fill="{p['primary']}"/>
        <path d="M 32 30 H 10 A 10 10 0 0 1 0 20" fill="none" stroke="{p['primary']}" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="0" cy="20" r="5" fill="{p['primary']}"/>
      </g>
    </g>
    '''
    return create_svg(content, mode)

# 12. Strategy Consulting
def svg_strategy_consulting(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="380" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Vertical Roadmap Stepped Path with Checkpoints -->
    <g transform="translate(150, 160)" filter="url(#shadow_{mode})">
      <rect x="0" y="0" width="300" height="480" rx="24" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      
      <!-- Stepped Roadmap Path -->
      <path d="M 60 400 L 60 300 L 150 300 L 150 180 L 240 180 L 240 80" fill="none" stroke="{p['primary']}" stroke-width="4.5" stroke-dasharray="6 6"/>
      
      <!-- Milestone Checkpoint 1 -->
      <circle cx="60" cy="400" r="14" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <circle cx="60" cy="400" r="6" fill="{p['primary']}"/>
      
      <!-- Milestone Checkpoint 2 -->
      <circle cx="150" cy="300" r="14" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <circle cx="150" cy="300" r="6" fill="{p['primary']}"/>
      
      <!-- Milestone Checkpoint 3 -->
      <circle cx="150" cy="180" r="14" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <circle cx="150" cy="180" r="6" fill="{p['primary']}"/>
      
      <!-- Top Target Compass Emblem -->
      <g transform="translate(240, 80)">
        <circle cx="0" cy="0" r="28" fill="{p['primary']}"/>
        <polygon points="0,-18 7,0 0,18 -7,0" fill="{p['bg']}"/>
      </g>
    </g>
    '''
    return create_svg(content, mode)

# 13. Cloud & Hosting
def svg_cloud_hosting(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="380" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Floating Minimalist Cloud Outline Above Server Blade Stack -->
    <!-- Server Stack (Bottom) -->
    <g transform="translate(140, 340)" filter="url(#shadow_{mode})">
      <!-- Server Blade 1 -->
      <rect x="0" y="0" width="320" height="70" rx="14" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      <circle cx="35" cy="35" r="6" fill="{p['primary']}"/>
      <circle cx="55" cy="35" r="6" fill="{p['border']}"/>
      <rect x="90" y="30" width="180" height="10" rx="3" fill="{p['body']}" opacity="0.3"/>
      
      <!-- Server Blade 2 -->
      <rect x="0" y="90" width="320" height="70" rx="14" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="2"/>
      <circle cx="35" cy="125" r="6" fill="{p['primary']}"/>
      <circle cx="55" cy="125" r="6" fill="{p['primary']}"/>
      <rect x="90" y="120" width="180" height="10" rx="3" fill="{p['heading']}"/>
      
      <!-- Server Blade 3 -->
      <rect x="0" y="180" width="320" height="70" rx="14" fill="{p['surface']}" stroke="{p['border']}" stroke-width="2"/>
      <circle cx="35" cy="215" r="6" fill="{p['primary']}"/>
      <circle cx="55" cy="215" r="6" fill="{p['border']}"/>
      <rect x="90" y="210" width="180" height="10" rx="3" fill="{p['body']}" opacity="0.3"/>
    </g>
    
    <!-- Cloud Silhouette (Top Centered) -->
    <g transform="translate(300, 220)" filter="url(#shadow_{mode})">
      <path d="M -70 40 A 45 45 0 0 1 -30 -35 A 60 60 0 0 1 70 -20 A 45 45 0 0 1 80 40 Z" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3"/>
      <path d="M -20 10 L 0 -10 L 20 10 M 0 -10 V 25" stroke="{p['primary']}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    '''
    return create_svg(content, mode)

# 14. Network Security
def svg_network_security(mode):
    p = PALETTES[mode]
    content = f'''
    <circle cx="300" cy="400" r="230" fill="url(#grad_{mode})"/>
    
    <!-- Concentric Protection Perimeter Circles -->
    <g transform="translate(300, 400)">
      <circle cx="0" cy="0" r="210" fill="none" stroke="{p['border']}" stroke-width="1.5" stroke-dasharray="6 10"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="{p['primary']}" stroke-width="2" opacity="0.4"/>
      <circle cx="0" cy="0" r="110" fill="none" stroke="{p['primary']}" stroke-width="2" stroke-dasharray="4 6"/>
      
      <!-- Security Shield Lock Emblem -->
      <g filter="url(#shadow_{mode})">
        <path d="M 0 -80 L 65 -40 V 30 C 65 75 0 105 0 105 C 0 105 -65 75 -65 30 V -40 Z" fill="{p['surface']}" stroke="{p['primary']}" stroke-width="3.5"/>
        
        <!-- Lock Keyhole Icon -->
        <rect x="-20" y="-10" width="40" height="35" rx="6" fill="{p['primary']}"/>
        <path d="M -12 -10 V -22 C -12 -32 12 -32 12 -22 V -10" fill="none" stroke="{p['primary']}" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="0" cy="4" r="5" fill="{p['bg']}"/>
      </g>
    </g>
    '''
    return create_svg(content, mode)

SERVICES = {
    "software_development": svg_software_dev,
    "web_development": svg_web_dev,
    "app_development": svg_app_dev,
    "api_integration": svg_api_integration,
    "ui_ux_design": svg_ui_ux_design,
    "graphic_design": svg_graphic_design,
    "branding": svg_branding,
    "motion_graphics": svg_motion_graphics,
    "ecommerce": svg_ecommerce,
    "digital_marketing": svg_digital_marketing,
    "bpo_services": svg_bpo_services,
    "strategy_consulting": svg_strategy_consulting,
    "cloud_hosting": svg_cloud_hosting,
    "network_security": svg_network_security
}

for name, generator in SERVICES.items():
    for mode in ["light", "dark"]:
        filename = f"{name}_{mode}.svg"
        path = os.path.join(output_dir, filename)
        svg_data = generator(mode)
        with open(path, "w", encoding="utf-8") as f:
            f.write(svg_data)
        print(f"Generated SVG: {filename}")

print("All 28 SVG images generated successfully!")
