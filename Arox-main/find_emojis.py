import os
import re

emoji_pattern = re.compile(r'[^\w\s,\.\-!:;\'"&\?\(\)\[\]\{\}\\/<>=\+\*#@\$%_\`~\|\^\x00-\x7F]')
emoji_files = []

for root, dirs, files in os.walk('views'):
    for file in files:
        if file.endswith('.ejs'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                if emoji_pattern.search(content):
                    emoji_files.append(path)

print('Files with emojis:')
for f in emoji_files:
    print(f)
