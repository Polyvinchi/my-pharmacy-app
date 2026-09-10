import codecs
with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
    text = f.read()
start = text.find('id="tab-flashcards"')
end = text.find('</section>', start)
print(text[start:end+10].encode('ascii', 'ignore').decode())
