import codecs

def extract_div(html, div_id):
    search_str = f'<div id="{div_id}"'
    start_idx = html.find(search_str)
    if start_idx == -1: return ""
    
    count = 0
    in_div = False
    
    pos = start_idx
    while pos < len(html):
        next_open = html.find('<div', pos)
        next_close = html.find('</div', pos)
        
        if next_open != -1 and next_open < next_close:
            count += 1
            pos = next_open + 4
        elif next_close != -1:
            count -= 1
            pos = next_close + 5
            if count == 0:
                end_pos = html.find('>', pos) + 1
                return html[start_idx:end_pos]
        else:
            break
    return ""

def inject_tabs():
    with codecs.open('e:/a-a-pharmacy/v3_backup.html', 'r', 'utf-8') as f:
        v3_html = f.read()
        
    old_tabs = ['tab-index', 'tab-triage', 'tab-rx', 'tab-flashcards']
    new_sections = []
    
    for tab in old_tabs:
        div_html = extract_div(v3_html, tab)
        if div_html:
            # We want to replace `<div id="tab-xyz" class="...">` with `<section id="tab-xyz" class="tab-pane hidden max-w-6xl mx-auto w-full">`
            # and `</div>` at the end with `</section>`
            
            # Find the first >
            first_gt = div_html.find('>')
            inner_html = div_html[first_gt+1:-6] # skip </div> at end
            
            section_html = f'<section id="{tab}" class="tab-pane hidden max-w-6xl mx-auto w-full">\n{inner_html}\n</section>'
            new_sections.append(section_html)
            
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        index_html = f.read()
        
    injected_str = "\n\n".join(new_sections)
    index_html = index_html.replace('<!-- TAB_INJECT_MARKER -->', injected_str)
    
    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(index_html)
        
    print("Injection complete!")

inject_tabs()
