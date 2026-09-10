import codecs
import re

def fix_highlight_and_counter():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # 1. Update handleSearch to pass query
    app_js = app_js.replace('renderCards(filtered);', 'renderCards(filtered, q);')
    app_js = app_js.replace('renderCards(ALL_DRUGS);', 'renderCards(ALL_DRUGS, \'\');')

    # 2. Rewrite renderCards to use highlightMatch
    # First, let's extract the exact renderCards function
    start = app_js.find('function renderCards(drugs)')
    end = app_js.find('function openDrugModal')
    
    render_cards_fixed = """
function renderCards(drugs, query = '') {
    const container = document.getElementById('drugsGrid');
    const alertBox = document.getElementById('noResultsAlert');
    
    if (!container) return;

    if (drugs.length === 0) {
        container.innerHTML = '';
        if (alertBox) alertBox.classList.remove('hidden');
        return;
    }
    
    if (alertBox) alertBox.classList.add('hidden');
    container.innerHTML = drugs.map(d => {
        const tName = highlightMatch(d.trade_name || '', query);
        const aName = highlightMatch(d.name_ar || '', query);
        const aIng  = highlightMatch(d.active_ingredient || '', query);
        const ind   = highlightMatch(d.indications || '', query);
        
        return `
        <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-emerald-900/20 group relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-bl-lg opacity-50">#${d.id}</div>
            
            <div class="flex items-start justify-between">
                <div class="flex-1 pr-2">
                    <h3 class="font-bold text-lg md:text-xl text-white mb-1 group-hover:text-emerald-400 transition-colors" dir="ltr">${tName}</h3>
                    <p class="text-sm text-slate-400 mb-2">${aName}</p>
                </div>
            </div>

            <div class="space-y-3 mt-4 border-t border-slate-800/60 pt-4">
                <div class="flex items-start gap-2 text-sm">
                    <i data-lucide="flask-conical" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                    <span class="text-slate-300 leading-relaxed font-medium" dir="ltr">${aIng}</span>
                </div>
                
                <div class="flex items-start gap-2 text-sm">
                    <i data-lucide="info" class="w-4 h-4 text-blue-400 shrink-0 mt-0.5"></i>
                    <span class="text-slate-400 leading-relaxed">${ind}</span>
                </div>
            </div>
            
            ${(d.critical_warnings || d.clinical_pearl) ? `
            <div class="mt-4 flex gap-2">
                ${d.critical_warnings ? `<span class="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3 h-3"></i> تحذير حرج</span>` : ''}
                ${d.clinical_pearl ? `<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><i data-lucide="lightbulb" class="w-3 h-3"></i> تريكة سريرية</span>` : ''}
            </div>
            ` : ''}
        </div>
    `}).join('');

    if (window.lucide) lucide.createIcons();
}

"""
    app_js = app_js[:start] + render_cards_fixed + app_js[end:]

    # Ensure initFlashcards updates UI completely
    app_js = app_js.replace("updateMasteredCount();", "updateMasteredCount();\n    document.getElementById('fcTotal').innerText = currentFlashcards.length;")
    
    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("Fixes applied successfully.")

fix_highlight_and_counter()
