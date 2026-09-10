import codecs

with codecs.open('e:/a-a-pharmacy/create_app.py', 'r', 'utf-8') as f:
    content = f.read()

start_str = 'html_template = r"""'
start_idx = content.find(start_str) + len(start_str)
end_idx = content.find('"""\n\n    # Insert JSON data', start_idx)
if end_idx == -1:
    end_idx = content.rfind('"""')

html = content[start_idx:end_idx].strip()
with codecs.open('e:/a-a-pharmacy/v3_backup.html', 'w', 'utf-8') as f:
    f.write(html)
