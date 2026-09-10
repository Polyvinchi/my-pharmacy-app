import codecs
with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
    text = f.read()
print('Has drugsGrid:', 'drugsGrid' in text)
print('Has tab-directory:', 'tab-directory' in text)
print('Has interviewCases:', 'interviewCasesContainer' in text)
print('Has broken section:', '<section \n' in text or '<section\n' in text)

# Fix broken section tag if present
if '<section \n            <!-- Tab Devices' in text:
    text = text.replace('<section \n            <!-- Tab Devices', '<!-- Tab Devices')
    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(text)
    print("Fixed broken section tag")
