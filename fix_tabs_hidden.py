import codecs
import re

with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
    text = f.read()

# Remove 'hidden' from all tab-pane elements since we use CSS .active
# Pattern: class="... tab-pane ... hidden ..."
new_text = re.sub(r'(class="[^"]*tab-pane[^"]*) hidden([^"]*")', r'\1\2', text)
new_text = re.sub(r'(class="[^"]*) hidden( [^"]*tab-pane[^"]*")', r'\1\2', new_text)

# Count changes
changes = text.count('tab-pane') 
print(f"tab-pane count: {changes}")

with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
    f.write(new_text)

print("Done - removed hidden from tab-panes")
