import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract header
header_match = re.search(r'(<header id="site-header">.*?</header>)', index_html, re.DOTALL)
header = header_match.group(1) if header_match else ''

# Extract mobile menu
mobile_match = re.search(r'(<div id="mobile-menu" aria-hidden="true">.*?</nav>\s*<div class="mobile-bottom">.*?</div>\s*</div>)', index_html, re.DOTALL)
mobile_menu = mobile_match.group(1) if mobile_match else ''

# Extract footer
footer_match = re.search(r'(<footer>.*?</footer>)', index_html, re.DOTALL)
footer = footer_match.group(1) if footer_match else ''

if not header or not mobile_menu or not footer:
    print('Failed to extract from index.html')
    exit(1)

with open('detail.html', 'r', encoding='utf-8') as f:
    detail_html = f.read()

# Check if detail.html is currently the "broken" version (has <header id="site-header"> already incorrectly placed)
if '<header id="site-header">' in detail_html:
    print("Found existing site-header, removing it and mobile menu...")
    # Remove everything from <header id="site-header"> up to <main...
    detail_html = re.sub(r'<header id="site-header">.*?(?=<main)', '', detail_html, flags=re.DOTALL)
else:
    print("Found old Tailwind nav, removing it...")
    # Remove the old Tailwind nav
    detail_html = re.sub(r'<nav\s+class="fixed w-full top-0.*?</nav>', '', detail_html, flags=re.DOTALL)

# Remove the footer (either the new one or the old Tailwind one)
if '<footer>' in detail_html:
    detail_html = re.sub(r'<footer>.*?</footer>', '', detail_html, flags=re.DOTALL)
else:
    detail_html = re.sub(r'<footer class="bg-white border-t border-gray-100.*?(?=<script>)', '', detail_html, flags=re.DOTALL)

# Insert new header and mobile menu right after <body ...>
body_pattern = r'(<body[^>]*>)'
detail_html = re.sub(body_pattern, f'\\1\n    {header}\n    {mobile_menu}\n', detail_html)

# Insert new footer before <script> tags at the end of the document
script_pattern = r'(<script>\s*AOS\.init)'
detail_html = re.sub(script_pattern, f'{footer}\n    \\1', detail_html)

# Add style.css and main.js to head if missing
if 'css/style.css' not in detail_html:
    detail_html = detail_html.replace('</head>', '    <link rel="stylesheet" href="css/style.css">\n    <script src="js/main.js" defer></script>\n</head>')

with open('detail.html', 'w', encoding='utf-8') as f:
    f.write(detail_html)

print('Updated detail.html successfully')
