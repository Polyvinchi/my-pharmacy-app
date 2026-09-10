import codecs
import re

def fix_all():
    # 1. Fix index.html sidebar translate direction
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        html = f.read()
    
    html = html.replace('-translate-x-full', 'translate-x-full')
    
    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(html)

    # 2. Fix app.js
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # Toggle fix
    app_js = app_js.replace("sidebar.classList.toggle('-translate-x-full');", "sidebar.classList.toggle('translate-x-full');")

    # Force flashcards rewrite
    start = app_js.find('function initFlashcards')
    
    # find where renderOTC starts
    end = app_js.find('function renderOTC')
    if end == -1: end = app_js.find('function renderIngredients')
    
    flashcard_logic = """
function initFlashcards() {
    currentFlashcards = ALL_DRUGS.filter(d => d.clinical_pearl || d.critical_warnings);
    currentFlashcards = currentFlashcards.sort(() => 0.5 - Math.random());
    
    const fcTotal = document.getElementById('fcTotal');
    if(fcTotal) fcTotal.innerText = currentFlashcards.length;
    
    masteredCards.clear();
    updateMasteredCount();
    
    flashcardIndex = 0;
    showFlashcard();
}

function updateMasteredCount() {
    const el = document.getElementById('fcProgress');
    if(el) el.innerText = masteredCards.size;
}

function showFlashcard() {
    if (!currentFlashcards || currentFlashcards.length === 0) return;
    if (flashcardIndex >= currentFlashcards.length) flashcardIndex = 0;
    
    const card = currentFlashcards[flashcardIndex];
    const container = document.getElementById('flashcardContainer');
    if (!container) return;
    
    // Smooth reset
    container.style.transition = 'none';
    container.classList.remove('flipped');
    setTimeout(() => container.style.transition = 'transform 0.6s', 50);
    
    const frontName = document.getElementById('fcFrontName');
    if(frontName) frontName.innerText = card.trade_name || '-';
    
    const frontForm = document.getElementById('fcFrontForm');
    if(frontForm) frontForm.innerText = card.name_ar || card.dosage_form || '-';
    
    const backActive = document.getElementById('fcBackActive');
    if(backActive) backActive.innerText = card.active_ingredient || '-';
    
    const backIndication = document.getElementById('fcBackIndication');
    if(backIndication) backIndication.innerText = card.indications || '-';
    
    const backPearl = document.getElementById('fcBackPearl');
    if(backPearl) {
        const pearlText = (card.clinical_pearl || '') + (card.critical_warnings ? '\\n\\n⚠ ' + card.critical_warnings : '');
        backPearl.innerText = pearlText || '-';
    }
}

function markFlashcard(isMastered) {
    if (!currentFlashcards || currentFlashcards.length === 0) return;
    
    if (isMastered) {
        masteredCards.add(currentFlashcards[flashcardIndex].id);
        updateMasteredCount();
    }
    
    flashcardIndex++;
    showFlashcard();
}

"""
    app_js = app_js[:start] + flashcard_logic + app_js[end:]
    
    # globals
    if 'let currentFlashcards' not in app_js:
        app_js = "let currentFlashcards = [];\nlet flashcardIndex = 0;\n" + app_js

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("Sidebar fixed. Flashcard logic fully replaced.")

fix_all()
