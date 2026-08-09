import os
import re

# Map emojis to Lucide icons
emoji_map = {
    '📅': '<i data-lucide="calendar"></i>',
    '👥': '<i data-lucide="users"></i>',
    '🎓': '<i data-lucide="graduation-cap"></i>',
    '💰': '<i data-lucide="indian-rupee"></i>', # Assuming INR context or just 'banknote'/'wallet'
    '✅': '<i data-lucide="check-circle-2"></i>',
    '📈': '<i data-lucide="trending-up"></i>',
    '👋': '<i data-lucide="hand"></i>',
    '🧑‍🎓': '<i data-lucide="graduation-cap"></i>',
    '👨‍🎓': '<i data-lucide="graduation-cap"></i>',
    '👩‍🎓': '<i data-lucide="graduation-cap"></i>',
    '📖': '<i data-lucide="book-open"></i>',
    '⏱️': '<i data-lucide="clock"></i>',
    '⏱': '<i data-lucide="clock"></i>',
    '⏳': '<i data-lucide="hourglass"></i>',
    '🏢': '<i data-lucide="building"></i>',
    '📍': '<i data-lucide="map-pin"></i>',
    '📝': '<i data-lucide="file-text"></i>',
    '🔍': '<i data-lucide="search"></i>',
    '✨': '<i data-lucide="sparkles"></i>',
    '🚀': '<i data-lucide="rocket"></i>',
    '⚠️': '<i data-lucide="alert-triangle"></i>',
    '❌': '<i data-lucide="x-circle"></i>',
    '🔔': '<i data-lucide="bell"></i>',
    '⚙️': '<i data-lucide="settings"></i>',
    '⚙': '<i data-lucide="settings"></i>',
    '💳': '<i data-lucide="credit-card"></i>',
    '💵': '<i data-lucide="banknote"></i>',
    '📱': '<i data-lucide="smartphone"></i>',
    '✉️': '<i data-lucide="mail"></i>',
    '✉': '<i data-lucide="mail"></i>',
    '🔒': '<i data-lucide="lock"></i>',
    '🔑': '<i data-lucide="key"></i>',
    '🎉': '<i data-lucide="party-popper"></i>',
    '🏆': '<i data-lucide="trophy"></i>',
    '⭐': '<i data-lucide="star"></i>',
    '💡': '<i data-lucide="lightbulb"></i>',
    '📊': '<i data-lucide="bar-chart"></i>',
    '📋': '<i data-lucide="clipboard-list"></i>',
    '📌': '<i data-lucide="pin"></i>',
    '👨‍💻': '<i data-lucide="laptop"></i>',
    '👩‍💻': '<i data-lucide="laptop"></i>',
    '💻': '<i data-lucide="laptop"></i>',
    '📁': '<i data-lucide="folder"></i>',
    '📂': '<i data-lucide="folder-open"></i>',
    '📄': '<i data-lucide="file"></i>',
    '🛠️': '<i data-lucide="tool"></i>',
    '🛠': '<i data-lucide="tool"></i>',
    '👨‍🏫': '<i data-lucide="presentation"></i>',
    '▶️': '<i data-lucide="play-circle"></i>',
    '▶': '<i data-lucide="play-circle"></i>'
}

def replace_emojis_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for emoji, icon in emoji_map.items():
        content = content.replace(emoji, icon)
    
    # Catch any remaining ones?
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('views'):
    for file in files:
        if file.endswith('.ejs'):
            filepath = os.path.join(root, file)
            replace_emojis_in_file(filepath)
            
print("Done replacing known emojis.")
