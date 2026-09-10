import codecs

def extract_div(html, div_id):
    search_str = f'<div id="{div_id}"'
    start_idx = html.find(search_str)
    if start_idx == -1: return ""
    
    count = 0
    in_div = False
    
    # We will search tag by tag
    pos = start_idx
    while pos < len(html):
        # Find next tag
        next_open = html.find('<div', pos)
        next_close = html.find('</div', pos)
        
        if next_open != -1 and next_open < next_close:
            count += 1
            pos = next_open + 4
        elif next_close != -1:
            count -= 1
            pos = next_close + 5
            if count == 0:
                # We found the end!
                end_pos = html.find('>', pos) + 1
                return html[start_idx:end_pos]
        else:
            break
            
    return ""

def build_ultimate():
    with codecs.open('e:/a-a-pharmacy/v3_backup.html', 'r', 'utf-8') as f:
        v3_html = f.read()

    tab_ids = ['tab-directory', 'tab-shelf', 'tab-index', 'tab-calc', 'tab-triage', 'tab-rx', 'tab-flashcards', 'tab-interview']
    sections = {}
    for tab in tab_ids:
        content = extract_div(v3_html, tab)
        if content:
            sections[tab] = content
            print(f"Found {tab}: length {len(content)}")

    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        new_html = f.read()
        
    # Replace the mainWorkspace
    # In the new_html, mainWorkspace might be empty or partially filled because my previous merge failed
    
    # Let's take a fresh copy of the new html from our base if possible, or just replace the inner contents of mainWorkspace.
    # mainWorkspace starts at `id="mainWorkspace">` and ends before `</main>`
    start_tag = 'id="mainWorkspace">'
    ws_start = new_html.find(start_tag) + len(start_tag)
    ws_end = new_html.rfind('</main>')
    
    # ensure we don't grab the wrong `</main>` if there are multiple
    
    for tab in tab_ids:
        # add hidden
        if tab != 'tab-directory':
            if 'hidden' not in sections[tab]:
                sections[tab] = sections[tab].replace('class="tab-pane', 'class="tab-pane hidden')
        else:
            sections[tab] = sections[tab].replace('hidden', '')
            
    workspace_content = "\n\n".join([sections.get(t, '') for t in tab_ids])
    
    new_html = new_html[:ws_start] + "\n" + workspace_content + "\n" + new_html[ws_end:]
    
    # Sidebar navigation replacement
    nav_buttons = """
                <button onclick="switchTab('tab-directory')" id="btn-tab-directory" class="nav-btn active w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-emerald-400 bg-slate-800/80 transition-all">
                    <i data-lucide="search" class="w-4 h-4 shrink-0"></i> الدليل والبحث الفوري
                </button>
                <button onclick="switchTab('tab-shelf')" id="btn-tab-shelf" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="layers" class="w-4 h-4 shrink-0"></i> رفوف الصيدلية
                </button>
                <button onclick="switchTab('tab-index')" id="btn-tab-index" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="flask-conical" class="w-4 h-4 shrink-0"></i> دليل المواد الفعالة
                </button>
                <button onclick="switchTab('tab-calc')" id="btn-tab-calc" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="calculator" class="w-4 h-4 shrink-0"></i> حاسبة الأطفال
                </button>
                <button onclick="switchTab('tab-triage')" id="btn-tab-triage" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="package-plus" class="w-4 h-4 shrink-0"></i> بروتوكولات OTC
                </button>
                <button onclick="switchTab('tab-rx')" id="btn-tab-rx" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="file-text" class="w-4 h-4 shrink-0"></i> فك الروشتات (LASA)
                </button>
                <button onclick="switchTab('tab-flashcards')" id="btn-tab-flashcards" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-amber-400 hover:bg-amber-950/30 transition-all">
                    <i data-lucide="zap" class="w-4 h-4 text-amber-500 shrink-0"></i> فلاش كاردز (تدريب)
                </button>
                <button onclick="switchTab('tab-interview')" id="btn-tab-interview" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-400 hover:bg-rose-950/30 transition-all">
                    <i data-lucide="shield-alert" class="w-4 h-4 text-rose-500 shrink-0"></i> فخاخ الإنترفيو والـ Red Flags
                </button>
    """
    
    nav_start = new_html.find('<nav class="p-3 space-y-1">') + len('<nav class="p-3 space-y-1">')
    nav_end = new_html.find('</nav>', nav_start)
    new_html = new_html[:nav_start] + "\n" + nav_buttons + "\n" + new_html[nav_end:]
    
    # Also we MUST put back the `#detailModal` if we overwrote it. It's actually placed AFTER the `</main>`.
    # Let's ensure `<div id="detailModal"` is present.
    if 'id="detailModal"' not in new_html:
        print("Wait, modal is missing. Let me add it.")
        modal_html = """
    <!-- Modal Popup لعرض التفاصيل -->
    <div id="detailModal" class="fixed inset-0 bg-slate-950/80 z-50 hidden backdrop-blur-sm flex items-center justify-center p-4 transition-all opacity-0 pointer-events-none" onclick="closeModal()">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative transition-transform transform scale-95" onclick="event.stopPropagation()" id="detailModalContent">
            <button onclick="closeModal()" class="absolute left-4 top-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-1 transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div id="modalContent">
                <!-- Populated Dynamically -->
            </div>
        </div>
    </div>
        """
        new_html = new_html.replace('</body>', modal_html + '\n</body>')

    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(new_html)
        
    print("HTML rewrite done.")

    # Now for app.js
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()
        
    funcs_to_extract = ['renderOTC', 'renderIngredients', 'selectIngredient', 'initFlashcards', 'showFlashcard', 'markFlashcard', 'updateMasteredCount', 'highlightMatch']
    
    extracted_js = ""
    for func in funcs_to_extract:
        start = v3_html.find(f'function {func}(')
        if start != -1:
            brace_count = 0
            in_func = False
            for i in range(start, len(v3_html)):
                if v3_html[i] == '{':
                    brace_count += 1
                    in_func = True
                elif v3_html[i] == '}':
                    brace_count -= 1
                if in_func and brace_count == 0:
                    extracted_js += "\n\n" + v3_html[start:i+1]
                    break

    init_hook = """
    if(typeof renderOTC === 'function') renderOTC();
    if(typeof renderIngredients === 'function') renderIngredients();
    if(typeof initFlashcards === 'function') initFlashcards();
    """
    
    if 'renderOTC()' not in app_js:
        app_js = app_js.replace('renderInterviewCases();', f'renderInterviewCases();\n{init_hook}')
        
        flashcard_vars = """
let flashcards = [];
let currentCardIndex = 0;
let masteredCards = new Set();
        """
        app_js = flashcard_vars + "\n" + app_js + "\n" + extracted_js

        with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
            f.write(app_js)
            
    print("JS merge done.")

build_ultimate()
