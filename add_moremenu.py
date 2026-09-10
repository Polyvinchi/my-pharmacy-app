import codecs

def add_moremenu():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    more_menu_funcs = """
// ===== BOTTOM NAV MORE MENU =====
function toggleMoreMenu() {
    const menu = document.getElementById('moreMenu');
    const overlay = document.getElementById('moreMenuOverlay');
    if (!menu) return;
    menu.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

function closeMoreMenu() {
    const menu = document.getElementById('moreMenu');
    const overlay = document.getElementById('moreMenuOverlay');
    if (menu) menu.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

"""

    # Also patch switchTab to handle bottom nav buttons
    app_js = app_js.replace(
        'function switchTab(tabId, pushHistory = true) {',
        '''function switchTab(tabId, pushHistory = true) {
    // Update bottom nav
    document.querySelectorAll('.bnav-btn').forEach(b => {
        b.classList.remove('active');
        b.querySelector('i').style.color = '';
        b.querySelector('span').style.color = '';
    });
    const bnavBtn = document.getElementById('bnav-' + tabId);
    if (bnavBtn) bnavBtn.classList.add('active');
    
    // Sync total count to more menu
    const totalEl = document.getElementById('totalDrugsCountBottom');
    const mainEl = document.getElementById('totalDrugsCount');
    if (totalEl && mainEl) totalEl.innerText = mainEl.innerText;
    const mobileEl = document.getElementById('totalDrugsCountMobile');
    if (mobileEl && mainEl) mobileEl.innerText = mainEl.innerText;
'''
    )

    if 'toggleMoreMenu' not in app_js:
        app_js = more_menu_funcs + app_js
    else:
        app_js = app_js  # already there

    app_js = more_menu_funcs + app_js if 'toggleMoreMenu' not in app_js else app_js

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("More menu and bottom nav sync added.")

add_moremenu()
