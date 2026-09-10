import re
with open('e:/a-a-pharmacy/v3_backup.html', 'r', encoding='utf-8') as f:
    text = f.read()
matches = re.findall(r'<div id="tab-[^"]+"', text)
print(matches)
