import re
with open('e:/a-a-pharmacy/v3_backup.html', 'r', encoding='utf-8') as f:
    v3_html = f.read()

tab_ids = ['tab-directory', 'tab-shelf', 'tab-ingredients', 'tab-calc', 'tab-otc', 'tab-rx', 'tab-flashcards', 'tab-interview']
for tab in tab_ids:
    pattern = f'<section id="{tab}".*?</section>'
    match = re.search(pattern, v3_html, re.DOTALL)
    if match:
        print(f'{tab}: {len(match.group(0))}')
    else:
        print(f'{tab}: NOT FOUND')
