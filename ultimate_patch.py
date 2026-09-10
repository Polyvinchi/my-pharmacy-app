import codecs
import re

def apply_patch():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # 1. Fix handleSearch for loose category matching
    search_fix = """
function categoryMatch(drugCat, filterCat) {
    if (!drugCat) return false;
    if (filterCat === 'الكل') return true;
    if (drugCat.includes(filterCat)) return true;
    
    // Loose mapping for common variations
    if (filterCat === 'حقن وطوارئ' && (drugCat.includes('طوارئ') || drugCat.includes('حقن'))) return true;
    if (filterCat === 'جلدية وحروق' && (drugCat.includes('جلدية') || drugCat.includes('حروق') || drugCat.includes('موضعي'))) return true;
    if (filterCat === 'مسكنات' && (drugCat.includes('مسكن') || drugCat.includes('عظام'))) return true;
    if (filterCat === 'أطفال' && drugCat.includes('أطفال')) return true;
    if (filterCat === 'جهاز هضمي' && (drugCat.includes('هضمي') || drugCat.includes('معدة'))) return true;
    if (filterCat === 'سكر ودهون' && (drugCat.includes('سكر') || drugCat.includes('دهون'))) return true;
    if (filterCat === 'ضغط وقلب' && (drugCat.includes('ضغط') || drugCat.includes('قلب'))) return true;
    
    return false;
}

function handleSearch(query) {
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.classList.toggle('hidden', !query);

    const q = query.trim().toLowerCase();
    const filtered = ALL_DRUGS.filter(d => {
        const matchCat = (CURRENT_FILTER_CATEGORY === 'الكل') || categoryMatch(d.system_category, CURRENT_FILTER_CATEGORY);
        if (!matchCat) return false;
        if (!q) return true;

        return (d.trade_name && d.trade_name.toLowerCase().includes(q)) ||
               (d.name_ar && d.name_ar.includes(q)) ||
               (d.active_ingredient && d.active_ingredient.toLowerCase().includes(q)) ||
               (d.indications && d.indications.includes(q)) ||
               (d.clinical_pearl && d.clinical_pearl.includes(q));
    });

    renderCards(filtered);
}
"""
    app_js = re.sub(r'function handleSearch\s*\([^)]*\)\s*\{.*?(?=function clearSearch)', search_fix, app_js, flags=re.DOTALL)

    # 2. Fix selectIngredient
    ing_fix = """
function selectIngredient(ingName) {
    const input = document.getElementById('liveSearchInput');
    if (input) {
        input.value = ingName;
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.classList.remove('hidden');
    }
    
    // Set category to ALL to ensure we search the whole database
    CURRENT_FILTER_CATEGORY = 'الكل';
    document.querySelectorAll('.chip-btn').forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'font-bold');
        b.classList.add('bg-slate-800', 'text-slate-300');
    });
    const allBtn = document.querySelector('.chip-btn'); // first chip is usually ALL
    if (allBtn) {
        allBtn.classList.add('bg-emerald-600', 'text-white', 'font-bold');
        allBtn.classList.remove('bg-slate-800', 'text-slate-300');
    }

    handleSearch(ingName);
    switchTab('tab-directory');
}
"""
    app_js = re.sub(r'function selectIngredient\([^)]*\)\s*\{.*?\}', ing_fix, app_js, flags=re.DOTALL)


    # 3. Fix Flashcard buttons
    flashcard_fix = """
function showFlashcard() {
    if (flashcards.length === 0) return;
    if (currentCardIndex >= flashcards.length) currentCardIndex = 0;
    
    const card = flashcards[currentCardIndex];
    const container = document.getElementById('flashcardContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div class="absolute top-0 right-0 bg-emerald-900/30 text-emerald-400 px-4 py-1 rounded-bl-xl font-bold text-sm">
                ${card.trade_name}
            </div>
            
            <div class="space-y-6 mt-4">
                <div class="text-center">
                    <h3 class="text-sm font-bold text-slate-500 mb-1">المادة الفعالة:</h3>
                    <p class="text-lg text-emerald-300">${card.active_ingredient || '-'}</p>
                </div>
                
                <div class="text-center">
                    <h3 class="text-sm font-bold text-slate-500 mb-1">الاستخدام السريع:</h3>
                    <p class="text-slate-300">${card.indications || '-'}</p>
                </div>

                ${card.clinical_pearl ? `
                <div class="bg-amber-950/30 p-4 rounded-xl border border-amber-900/50 mt-4">
                    <h3 class="text-sm font-bold text-amber-500 mb-2 flex items-center justify-center gap-2">
                        <i data-lucide="lightbulb" class="w-4 h-4"></i> التريكة السريرية (Clinical Pearl):
                    </h3>
                    <p class="text-amber-200 text-center leading-relaxed text-sm">${card.clinical_pearl}</p>
                </div>
                ` : ''}
                
                ${card.critical_warnings ? `
                <div class="bg-rose-950/30 p-4 rounded-xl border border-rose-900/50 mt-4">
                    <h3 class="text-sm font-bold text-rose-500 mb-2 flex items-center justify-center gap-2">
                        <i data-lucide="shield-alert" class="w-4 h-4"></i> تحذير حرج:
                    </h3>
                    <p class="text-rose-200 text-center leading-relaxed text-sm">${card.critical_warnings}</p>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="flex gap-3 mt-6">
            <button onclick="markFlashcard(false)" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <i data-lucide="x" class="w-5 h-5 text-rose-400"></i> أحتاج مراجعتها
            </button>
            <button onclick="markFlashcard(true)" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
                <i data-lucide="check" class="w-5 h-5"></i> أتقنتها
            </button>
        </div>
    `;
    
    if(window.lucide) lucide.createIcons();
}
"""
    app_js = re.sub(r'function showFlashcard\(\)\s*\{.*?\}\s*(?=function markFlashcard)', flashcard_fix, app_js, flags=re.DOTALL)


    # 4. Fix renderOTC to group by sections like before
    otc_fix = """
function renderOTC() {
    const grid = document.getElementById('otcGrid');
    if (!grid) return;
    
    // فلترة للـ OTC فقط (استبعاد الأجهزة)
    const otcItems = ALL_DRUGS.filter(d => 
        (d.id >= 251 && d.id <= 300) || 
        (d.system_category && d.system_category.includes('OTC')) ||
        (d.sub_form_type && d.sub_form_type.includes('OTC'))
    ).filter(d => !d.system_category || (!d.system_category.includes('أجهزة') && !d.system_category.includes('مستلزمات')));

    // Grouping
    const groups = {};
    otcItems.forEach(d => {
        const type = d.sub_form_type || 'أخرى';
        if (!groups[type]) groups[type] = [];
        groups[type].push(d);
    });

    let html = '';
    for (const [type, items] of Object.entries(groups)) {
        html += `
            <div class="col-span-full mt-6 mb-2 border-b border-slate-800 pb-2">
                <h3 class="text-emerald-400 font-bold text-lg flex items-center gap-2">
                    <i data-lucide="folder-open" class="w-5 h-5"></i> ${type}
                </h3>
            </div>
        `;
        html += items.map(d => `
            <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer">
                <h3 class="text-lg font-bold text-emerald-400 mb-2">${d.trade_name}</h3>
                <p class="text-sm text-slate-300 mb-3">${d.indications || ''}</p>
                <div class="bg-slate-800/50 p-2 rounded text-xs text-slate-400 font-mono">
                    ${d.dosage_and_admin || ''}
                </div>
            </div>
        `).join('');
    }

    grid.innerHTML = html;
    if (window.lucide) lucide.createIcons();
    
    if(typeof renderDevices === 'function') renderDevices();
}

function renderDevices() {
    const grid = document.getElementById('devicesGrid');
    if (!grid) return;
    
    // الأجهزة والمستلزمات
    const deviceItems = ALL_DRUGS.filter(d => 
        d.system_category && (d.system_category.includes('أجهزة') || d.system_category.includes('مستلزمات'))
    );
    
    grid.innerHTML = deviceItems.map(d => `
        <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all cursor-pointer">
            <h3 class="text-lg font-bold text-blue-400 mb-2">${d.trade_name}</h3>
            <p class="text-sm text-slate-300 mb-3">${d.indications || ''}</p>
            <div class="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50 mt-3">
                <span class="text-xs text-blue-300">💡 ${d.clinical_pearl || d.critical_warnings || 'معلومات هامة بالداخل'}</span>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}
"""
    app_js = re.sub(r'function renderOTC\(\)\s*\{.*?\}\s*(?=function renderIngredients|function backToShelfCategories)', otc_fix, app_js, flags=re.DOTALL)

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)
        
    print("All fixes applied successfully.")

apply_patch()
