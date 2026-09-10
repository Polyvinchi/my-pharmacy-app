import codecs
import re

def fix_flashcard_counter():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # The fix: 
    # 1. Remove the duplicate 'flashcards' variable (old V3 leftover)
    # 2. Update initFlashcards to always use currentFlashcards
    # 3. Make switchTab call showFlashcard when switching TO flashcards tab
    # 4. Update the counter ALSO when the tab becomes visible

    # Fix 1: Remove old V3 flashcards variable
    app_js = app_js.replace('let flashcards = [];\n', '')

    # Fix 2: Rewrite initFlashcards cleanly - no reference to fcTotal/fcProgress at init time
    old_init = app_js.find('function initFlashcards()')
    old_init_end = app_js.find('function updateMasteredCount', old_init)
    
    new_init = """function initFlashcards() {
    currentFlashcards = ALL_DRUGS.filter(d => d.clinical_pearl || d.critical_warnings);
    // Shuffle
    for (let i = currentFlashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentFlashcards[i], currentFlashcards[j]] = [currentFlashcards[j], currentFlashcards[i]];
    }
    masteredCards.clear();
    flashcardIndex = 0;
    // Update UI - called here AND when tab is opened
    refreshFlashcardUI();
}

// Separated UI update so it can be called anytime tab is shown
function refreshFlashcardUI() {
    const fcTotal = document.getElementById('fcTotal');
    if (fcTotal) fcTotal.innerText = currentFlashcards.length;
    updateMasteredCount();
    showFlashcard();
}

"""
    app_js = app_js[:old_init] + new_init + app_js[old_init_end:]

    # Fix 3: In markFlashcard, always update fcTotal too (in case it was 0 before)
    app_js = app_js.replace(
        """function markFlashcard(isMastered) {
    if (!currentFlashcards || currentFlashcards.length === 0) return;
    
    if (isMastered) {
        masteredCards.add(currentFlashcards[flashcardIndex].id);
        updateMasteredCount();
    }
    
    flashcardIndex++;
    showFlashcard();
}""",
        """function markFlashcard(isMastered) {
    if (!currentFlashcards || currentFlashcards.length === 0) return;
    
    if (isMastered) {
        masteredCards.add(currentFlashcards[flashcardIndex].id);
    }
    
    flashcardIndex++;
    
    // Always update both counters
    const fcTotal = document.getElementById('fcTotal');
    if (fcTotal) fcTotal.innerText = currentFlashcards.length;
    
    const fcProgress = document.getElementById('fcProgress');
    if (fcProgress) fcProgress.innerText = masteredCards.size;
    
    // Show progress toast when card mastered
    if (isMastered) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg';
        toast.innerText = '✓ أتقنتها! ' + masteredCards.size + ' / ' + currentFlashcards.length;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1800);
    }
    
    showFlashcard();
}"""
    )

    # Fix 4: Patch switchTab to call refreshFlashcardUI when switching to flashcards tab
    app_js = app_js.replace(
        """    // Sync counts
    const mainEl = document.getElementById('totalDrugsCount');""",
        """    // When switching to flashcards, refresh counter
    if (tabId === 'tab-flashcards') {
        setTimeout(() => { if (typeof refreshFlashcardUI === 'function') refreshFlashcardUI(); }, 50);
    }
    
    // Sync counts
    const mainEl = document.getElementById('totalDrugsCount');"""
    )

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("Flashcard counter fixed.")

fix_flashcard_counter()
