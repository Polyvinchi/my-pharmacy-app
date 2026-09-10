import codecs

def fix_select_ing():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        text = f.read()

    start = text.find('function selectIngredient')
    end = text.find('function initFlashcards')
    
    proper_func = """
function selectIngredient(ingName) {
    const input = document.getElementById('liveSearchInput');
    if (input) {
        input.value = ingName;
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.classList.remove('hidden');
    }
    
    CURRENT_FILTER_CATEGORY = 'الكل';
    document.querySelectorAll('.chip-btn').forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'font-bold');
        b.classList.add('bg-slate-800', 'text-slate-300');
    });
    const allBtn = document.querySelector('.chip-btn');
    if (allBtn) {
        allBtn.classList.add('bg-emerald-600', 'text-white', 'font-bold');
        allBtn.classList.remove('bg-slate-800', 'text-slate-300');
    }

    handleSearch(ingName);
    switchTab('tab-directory');
}

"""
    text = text[:start] + proper_func + text[end:]
    
    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(text)

fix_select_ing()
