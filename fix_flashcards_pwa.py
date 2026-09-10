import codecs
import re
import json

def fix_pwa_and_flashcards():
    # 1. Restore V3 Flashcards logic to app.js
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    flashcard_logic = """
function initFlashcards() {
    // Filter drugs that have clinical pearls or critical warnings
    currentFlashcards = ALL_DRUGS.filter(d => d.clinical_pearl || d.critical_warnings);
    
    // Randomize array
    currentFlashcards = currentFlashcards.sort(() => 0.5 - Math.random());
    
    document.getElementById('fcTotal').innerText = currentFlashcards.length;
    masteredCards.clear();
    updateMasteredCount();
    
    flashcardIndex = 0;
    showFlashcard();
}

function updateMasteredCount() {
    document.getElementById('fcProgress').innerText = masteredCards.size;
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
    
    document.getElementById('fcFrontName').innerText = card.trade_name || '-';
    document.getElementById('fcFrontForm').innerText = card.name_ar || card.dosage_form || '-';
    
    document.getElementById('fcBackActive').innerText = card.active_ingredient || '-';
    document.getElementById('fcBackIndication').innerText = card.indications || '-';
    
    const pearlText = (card.clinical_pearl || '') + (card.critical_warnings ? '\\n⚠ ' + card.critical_warnings : '');
    document.getElementById('fcBackPearl').innerText = pearlText || '-';
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
    # Replace the existing flashcard logic block
    # Note: my previous block had `initFlashcards` to `markFlashcard(isMastered) { ... }`
    app_js = re.sub(r'function initFlashcards\(\).*?function markFlashcard\([^)]*\)\s*\{[^\}]*\}(?=\s*function renderOTC)', flashcard_logic, app_js, flags=re.DOTALL)
    
    # ensure globals exist for currentFlashcards and flashcardIndex
    if 'let currentFlashcards' not in app_js:
        app_js = "let currentFlashcards = [];\nlet flashcardIndex = 0;\n" + app_js

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    # 2. Add PWA support to index.html
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        index_html = f.read()

    pwa_tags = """
    <!-- PWA Settings -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#020617">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icon.png">
    <meta name="mobile-web-app-capable" content="yes">
    """
    
    if '<meta name="theme-color"' not in index_html:
        index_html = index_html.replace('</head>', pwa_tags + '\n</head>')

    # Fix the missing flashcard structure in index.html, wait, it is already there!
    # Let me ensure the index.html has the fcTotal span. I know it does based on my check earlier.

    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(index_html)

    # 3. Create manifest.json
    manifest = {
      "name": "PharmaPocket EG",
      "short_name": "PharmaPocket",
      "start_url": "./index.html",
      "display": "standalone",
      "background_color": "#020617",
      "theme_color": "#059669",
      "icons": [
        {
          "src": "icon.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "icon.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    }
    with codecs.open('e:/a-a-pharmacy/manifest.json', 'w', 'utf-8') as f:
        f.write(json.dumps(manifest, ensure_ascii=False, indent=2))
        
    print("Flashcards logic restored and PWA support added.")

fix_pwa_and_flashcards()
