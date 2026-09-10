import codecs

def rewrite_html():
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        old = f.read()

    # Extract everything from the first section to the scripts
    sections_start = old.find('<section id="tab-directory"')
    sections_end = old.find('</div>\n    </main>')
    sections_content = old[sections_start:sections_end]

    # Extract scripts block
    scripts = old[old.find('<!-- استدعاء البيانات -->'):old.find('</body>')]

    # Extract modal
    modal = old[old.find('<!-- Modal Popup'):old.find('<!-- استدعاء البيانات -->')]

    new_html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PharmaPocket EG</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- PWA -->
    <meta name="theme-color" content="#020617">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icon.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <style>
        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0f172a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Flashcard 3D */
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; transition: transform 0.6s; }
        .flashcard.flipped .transform-style-3d { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        /* Highlight */
        mark.hl { background: #f59e0b40; color: #fbbf24; border-radius: 3px; padding: 0 2px; font-weight: bold; }
        
        /* Bottom Nav active */
        .bnav-btn.active i { color: #10b981; }
        .bnav-btn.active span { color: #10b981; }
        
        /* Sidebar Nav active */
        .nav-btn.active { background: rgba(16,185,129,0.15); color: #10b981; }
        
        /* Tab pane */
        .tab-pane { display: none; }
        .tab-pane.active { display: block; }
    </style>
</head>

<body class="bg-slate-950 text-slate-100 antialiased" style="height:100dvh; display:flex; flex-direction:column; overflow:hidden;">

<!-- ===== LAYOUT WRAPPER ===== -->
<div class="flex flex-1 overflow-hidden h-full">

    <!-- ===== DESKTOP SIDEBAR (hidden on mobile) ===== -->
    <aside class="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 border-l border-slate-800 h-full">
        <!-- Logo -->
        <div class="p-4 border-b border-slate-800 flex items-center gap-3">
            <i data-lucide="activity" class="text-emerald-500 w-6 h-6"></i>
            <h1 class="text-lg font-black text-emerald-400">PharmaPocket</h1>
        </div>
        <!-- Nav -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
            <button onclick="switchTab(\'tab-directory\')" id="btn-tab-directory" class="nav-btn active w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 transition-all">
                <i data-lucide="search" class="w-4 h-4 shrink-0"></i> الدليل والبحث الفوري
            </button>
            <button onclick="switchTab(\'tab-shelf\')" id="btn-tab-shelf" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="layers" class="w-4 h-4 shrink-0"></i> رفوف الصيدلية
            </button>
            <button onclick="switchTab(\'tab-index\')" id="btn-tab-index" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="flask-conical" class="w-4 h-4 shrink-0"></i> دليل المواد الفعالة
            </button>
            <button onclick="switchTab(\'tab-calc\')" id="btn-tab-calc" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="calculator" class="w-4 h-4 shrink-0"></i> حاسبة الأطفال
            </button>
            <button onclick="switchTab(\'tab-triage\')" id="btn-tab-triage" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="package-plus" class="w-4 h-4 shrink-0"></i> بروتوكولات OTC
            </button>
            <button onclick="switchTab(\'tab-devices\')" id="btn-tab-devices" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="stethoscope" class="w-4 h-4 shrink-0"></i> أجهزة ومستلزمات
            </button>
            <button onclick="switchTab(\'tab-rx\')" id="btn-tab-rx" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                <i data-lucide="file-text" class="w-4 h-4 shrink-0"></i> فك الروشتات (LASA)
            </button>
            <button onclick="switchTab(\'tab-flashcards\')" id="btn-tab-flashcards" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-950/30 transition-all">
                <i data-lucide="zap" class="w-4 h-4 shrink-0"></i> فلاش كاردز
            </button>
            <button onclick="switchTab(\'tab-interview\')" id="btn-tab-interview" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition-all">
                <i data-lucide="shield-alert" class="w-4 h-4 shrink-0"></i> فخاخ الإنترفيو
            </button>
        </nav>
        <!-- Footer -->
        <div class="p-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>أصناف: <strong id="totalDrugsCount" class="text-emerald-400">0</strong></span>
            <span class="text-emerald-600 font-mono">v3.0</span>
        </div>
    </aside>

    <!-- ===== MAIN AREA ===== -->
    <main class="flex-1 flex flex-col overflow-hidden">
        
        <!-- TOP HEADER: Logo (mobile) + Search + Chips -->
        <header class="bg-slate-900 border-b border-slate-800 shrink-0 z-10">
            <!-- Row 1: logo (mobile only) + search -->
            <div class="flex items-center gap-2 px-3 pt-3 pb-2">
                <!-- Mobile logo -->
                <div class="flex lg:hidden items-center gap-1.5 shrink-0">
                    <i data-lucide="activity" class="text-emerald-500 w-5 h-5"></i>
                    <span class="text-sm font-black text-emerald-400">PharmaPocket</span>
                </div>
                <!-- Search -->
                <div class="relative flex-1">
                    <i data-lucide="search" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"></i>
                    <input type="text" id="liveSearchInput"
                        placeholder="بحث (اسم تجاري، علمي، استخدام...)"
                        class="w-full bg-slate-950 text-white text-sm rounded-xl py-2.5 pr-10 pl-8 border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all"
                        oninput="handleSearch(this.value)">
                    <button id="clearSearchBtn" onclick="clearSearch()" class="hidden absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <!-- Count badge (desktop) -->
                <span class="hidden lg:flex items-center gap-1 text-xs text-slate-500 shrink-0">
                    <i data-lucide="database" class="w-3.5 h-3.5"></i>
                    <strong id="totalDrugsCountMobile" class="text-emerald-400">0</strong>
                </span>
            </div>
            <!-- Row 2: Filter chips -->
            <div class="flex gap-1.5 overflow-x-auto no-scrollbar px-3 pb-2.5 text-xs">
                <button onclick="setCategoryFilter(\'الكل\', this)" class="chip-btn active px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold whitespace-nowrap shrink-0">الكل</button>
                <button onclick="setCategoryFilter(\'أطفال\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">أطفال</button>
                <button onclick="setCategoryFilter(\'مسكنات\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">مسكنات</button>
                <button onclick="setCategoryFilter(\'جهاز هضمي\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">جهاز هضمي</button>
                <button onclick="setCategoryFilter(\'ضغط وقلب\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">ضغط وقلب</button>
                <button onclick="setCategoryFilter(\'سكر ودهون\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">سكر ودهون</button>
                <button onclick="setCategoryFilter(\'حقن وطوارئ\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">حقن وطوارئ</button>
                <button onclick="setCategoryFilter(\'جلدية وحروق\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">جلدية وحروق</button>
                <button onclick="setCategoryFilter(\'أعصاب ونفسية\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">أعصاب ونفسية</button>
                <button onclick="setCategoryFilter(\'نساء وتوليد\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">نساء وتوليد</button>
                <button onclick="setCategoryFilter(\'مسالك ومطهرات\', this)" class="chip-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium whitespace-nowrap shrink-0 border border-slate-700/50">مسالك ومطهرات</button>
            </div>
        </header>

        <!-- SCROLLABLE CONTENT -->
        <div class="flex-1 overflow-y-auto p-3 md:p-5 pb-24 lg:pb-6 bg-slate-950" id="mainWorkspace">
''' + "            " + sections_content + '''
        </div><!-- end mainWorkspace -->

    </main><!-- end main -->
</div><!-- end layout wrapper -->

<!-- ===== MOBILE BOTTOM NAV (hidden on desktop) ===== -->
<nav class="lg:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 z-40 safe-area-pb">
    <div class="flex items-stretch h-16">
        <button onclick="switchTab(\'tab-directory\')" id="bnav-tab-directory" class="bnav-btn active flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-500 transition-all">
            <i data-lucide="search" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">البحث</span>
        </button>
        <button onclick="switchTab(\'tab-shelf\')" id="bnav-tab-shelf" class="bnav-btn flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-500 transition-all">
            <i data-lucide="layers" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">الرفوف</span>
        </button>
        <button onclick="switchTab(\'tab-index\')" id="bnav-tab-index" class="bnav-btn flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-500 transition-all">
            <i data-lucide="flask-conical" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">مواد فعالة</span>
        </button>
        <button onclick="switchTab(\'tab-calc\')" id="bnav-tab-calc" class="bnav-btn flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-500 transition-all">
            <i data-lucide="calculator" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">حاسبة</span>
        </button>
        <!-- More button -->
        <button onclick="toggleMoreMenu()" id="btn-more" class="flex-1 flex flex-col items-center justify-center gap-0.5 text-slate-500 transition-all">
            <i data-lucide="grid-3x3" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">المزيد</span>
        </button>
    </div>
</nav>

<!-- MORE MENU POPUP (mobile) -->
<div id="moreMenu" class="lg:hidden hidden fixed inset-x-0 bottom-16 z-50 bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-4">
    <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4"></div>
    <div class="grid grid-cols-3 gap-3">
        <button onclick="switchTab(\'tab-triage\'); closeMoreMenu()" class="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 text-slate-400">
            <i data-lucide="package-plus" class="w-6 h-6 text-emerald-400"></i>
            <span class="text-xs font-bold">OTC</span>
        </button>
        <button onclick="switchTab(\'tab-devices\'); closeMoreMenu()" class="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 text-slate-400">
            <i data-lucide="stethoscope" class="w-6 h-6 text-blue-400"></i>
            <span class="text-xs font-bold">أجهزة</span>
        </button>
        <button onclick="switchTab(\'tab-rx\'); closeMoreMenu()" class="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 text-slate-400">
            <i data-lucide="file-text" class="w-6 h-6 text-cyan-400"></i>
            <span class="text-xs font-bold">روشتات</span>
        </button>
        <button onclick="switchTab(\'tab-flashcards\'); closeMoreMenu()" class="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 text-slate-400">
            <i data-lucide="zap" class="w-6 h-6 text-amber-400"></i>
            <span class="text-xs font-bold">فلاش كاردز</span>
        </button>
        <button onclick="switchTab(\'tab-interview\'); closeMoreMenu()" class="flex flex-col items-center gap-2 bg-slate-800 rounded-2xl p-4 text-slate-400">
            <i data-lucide="shield-alert" class="w-6 h-6 text-rose-400"></i>
            <span class="text-xs font-bold">الإنترفيو</span>
        </button>
        <div class="flex flex-col items-center gap-2 bg-slate-800/50 rounded-2xl p-4 text-slate-600">
            <span class="text-lg font-black text-emerald-500" id="totalDrugsCountBottom">0</span>
            <span class="text-[10px] font-bold">صنف</span>
        </div>
    </div>
    <button onclick="closeMoreMenu()" class="mt-4 w-full py-3 bg-slate-800 rounded-2xl text-slate-400 font-bold text-sm">إغلاق</button>
</div>
<!-- Overlay for more menu -->
<div id="moreMenuOverlay" onclick="closeMoreMenu()" class="hidden fixed inset-0 bg-black/50 z-40 lg:hidden"></div>

''' + modal + '''
    <!-- Data scripts -->
''' + scripts + '''
</body>
</html>'''

    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(new_html)
    
    print("Done! New responsive layout written.")

rewrite_html()
