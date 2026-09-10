import re
with open('e:/a-a-pharmacy/v3_backup.html', 'r', encoding='utf-8') as f:
    text = f.read()
matches = re.findall(r'<section id="[^"]+"', text)
print(matches)
