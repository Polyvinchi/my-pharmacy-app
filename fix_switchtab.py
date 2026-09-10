import codecs

def fix_switchtab():
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # Replace switchTab completely - use 'active' class properly, no 'hidden' conflict
    old_switchtab_start = app_js.find('function switchTab(tabId, pushState = true) {')
    old_switchtab_end = app_js.find('\nfunction toggleMobileSidebar', old_switchtab_start)
    
    new_switchtab = """function switchTab(tabId, pushState = true) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.remove('active');
    });

    // De-activate all sidebar nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active', 'text-emerald-400', 'bg-slate-800/80');
        b.classList.add('text-slate-400');
    });

    // Activate the target pane
    const activePane = document.getElementById(tabId);
    if (activePane) activePane.classList.add('active');

    // Activate sidebar button
    const activeBtn = document.getElementById('btn-' + tabId);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-emerald-400', 'bg-slate-800/80');
        activeBtn.classList.remove('text-slate-400');
    }

    // Activate bottom nav button
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
    const bnavBtn = document.getElementById('bnav-' + tabId);
    if (bnavBtn) bnavBtn.classList.add('active');

    // Sync counts
    const mainEl = document.getElementById('totalDrugsCount');
    if (mainEl) {
        const count = mainEl.innerText;
        const mobileEl = document.getElementById('totalDrugsCountMobile');
        if (mobileEl) mobileEl.innerText = count;
        const bottomEl = document.getElementById('totalDrugsCountBottom');
        if (bottomEl) bottomEl.innerText = count;
    }

    if (pushState) {
        history.pushState({ tab: tabId }, '', '#' + tabId);
    }
}

"""
    app_js = app_js[:old_switchtab_start] + new_switchtab + app_js[old_switchtab_end:]

    # Fix initializeDatabase to call switchTab('tab-directory') at end to ensure first tab shows
    if "switchTab('tab-directory', false)" not in app_js:
        app_js = app_js.replace(
            'if (window.lucide) lucide.createIcons();\n}',
            "if (window.lucide) lucide.createIcons();\n    switchTab('tab-directory', false);\n}",
            1  # only first occurrence
        )

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("switchTab fixed, uses .active class now.")

fix_switchtab()
