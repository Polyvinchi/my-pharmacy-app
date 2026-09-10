import re
import codecs

def build():
    with codecs.open('e:/a-a-pharmacy/create_app.py', 'r', 'utf-8') as f:
        content = f.read()

    # Extract template
    start_str = 'html_template = r"""'
    start_idx = content.find(start_str) + len(start_str)
    end_idx = content.find('"""\n\n    # Insert JSON data', start_idx)
    html = content[start_idx:end_idx]

    if end_idx == -1:
        end_idx = content.rfind('"""')
        html = content[start_idx:end_idx]

    # --- 1. Replace JSON injection with JS script imports ---
    scripts = "\n".join([f'    <script src="data/part{i}.js"></script>' for i in range(1, 14)])
    
    # We replace the script block containing `const DRUGS_DATA = {drugs_json};`
    # Let's find `function initApp() {` and modify it.
    
    html = html.replace('const DRUGS_DATA = {drugs_json};', scripts)
    
    initApp_replacement = """
        function initApp() {
            ALL_DRUGS = [
                ...(window.PART1_DATA || []),
                ...(window.PART2_DATA || []),
                ...(window.PART3_DATA || []),
                ...(window.PART4_DATA || []),
                ...(window.PART5_DATA || []),
                ...(window.PART6_DATA || []),
                ...(window.PART7_DATA || []),
                ...(window.PART8_DATA || []),
                ...(window.PART9_DATA || []),
                ...(window.PART10_DATA || []),
                ...(window.PART11_DATA || []),
                ...(window.PART12_DATA || []),
                ...(window.PART13_DATA || [])
            ];
            
            // Sort Alphabetically
            ALL_DRUGS.sort((a, b) => (a.trade_name || '').localeCompare(b.trade_name || ''));

            document.getElementById('totalDrugsCount').innerText = ALL_DRUGS.length;
            initDarkMode();
            setupEventListeners();
            
            // Handle browser back button (popstate)
            window.addEventListener('popstate', handlePopState);
            
            // Check current URL hash to load specific tab/modal
            handlePopState();
            
            renderDirectory();
            renderShelfCategories();
            initFlashcards();
            renderInterviewCases();

            if (window.lucide) {
                lucide.createIcons();
            }
        }
        
        function handlePopState(e) {
            const hash = window.location.hash;
            const modal = document.getElementById('drugModal');
            
            if (hash.startsWith('#drug-')) {
                const id = parseInt(hash.replace('#drug-', ''));
                showDrugDetails(id, false); // false = don't push state again
            } else {
                if (modal && !modal.classList.contains('hidden')) {
                    closeDrugModal(false); // false = don't push state
                }
                
                if (hash.startsWith('#tab-')) {
                    switchTab(hash.replace('#', ''), false);
                } else if (!hash) {
                    switchTab('tab-directory', false);
                }
            }
        }
"""
    
    html = re.sub(r'function initApp\(\) \{.*?(?=function initDarkMode)', initApp_replacement, html, flags=re.DOTALL)
    
    # Update switchTab to pushState
    switchTab_replacement = """
        function switchTab(tabId, push = true) {
            document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(el => {
                el.classList.remove('bg-emerald-500/10', 'text-emerald-500');
                el.classList.add('text-slate-600', 'dark:text-slate-400');
            });

            document.getElementById(tabId).classList.remove('hidden');
            const btn = document.getElementById('btn-' + tabId);
            if (btn) {
                btn.classList.add('bg-emerald-500/10', 'text-emerald-500');
                btn.classList.remove('text-slate-600', 'dark:text-slate-400');
            }
            if (window.innerWidth < 768) {
                document.getElementById('mobileMenu').classList.add('hidden');
            }
            
            if (push) {
                history.pushState({tab: tabId}, '', '#' + tabId);
            }
        }
"""
    html = re.sub(r'function switchTab\(tabId\) \{.*?(?=function initApp)', switchTab_replacement, html, flags=re.DOTALL)
    
    # Update showDrugDetails to pushState
    html = html.replace('function showDrugDetails(id) {', 'function showDrugDetails(id, push = true) {')
    html = html.replace("document.getElementById('drugModal').classList.remove('hidden');", """
            document.getElementById('drugModal').classList.remove('hidden');
            if (push) {
                history.pushState({modal: true, id: id}, '', '#drug-' + id);
            }
    """)
    
    # Update closeDrugModal to pushState
    html = html.replace('function closeDrugModal() {', 'function closeDrugModal(push = true) {')
    html = html.replace("document.getElementById('drugModal').classList.add('hidden');", """
            document.getElementById('drugModal').classList.add('hidden');
            if (push) {
                const activeTab = document.querySelector('.tab-pane:not(.hidden)').id;
                history.pushState({tab: activeTab}, '', '#' + activeTab);
            }
    """)
    
    # Fix the `document.getElementById('totalDrugsCount')` id inside the header.
    # The user template expects an element with this ID. Let's make sure it exists or add it.
    if 'id="totalDrugsCount"' not in html:
        # In my V3 header I had a badge with the count, but let's replace whatever was there.
        # It's probably `id="totalDrugsBadge"`. Let's just find `totalDrugsCount` and rename it or add the id.
        html = html.replace('id="totalDrugsBadge"', 'id="totalDrugsCount"')
    
    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(html)
        
build()
