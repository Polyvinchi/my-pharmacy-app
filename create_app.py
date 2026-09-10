import json
import os
import glob
import re

def get_combined_drugs():
    files = sorted(glob.glob('e:/a-a-pharmacy/study/s/part*.json'))
    all_drugs = []
    for f in files:
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                content = re.sub(r'\}\s*\n\s*\{', '},\n{', content)
                
                # Replace generics with real Egyptian trade names
                content = content.replace('"Mebo generic"', '"Renasource", "Dermaheal", "Burncure", "Mebo Scar"')
                content = content.replace('"Ibuprofen Generic"', '"Brufen", "Advil", "Ultrafen", "Marcofen"')
                content = content.replace('"Indapamide Generic"', '"Natrilix SR", "Fludex SR", "Tensopress"')
                content = content.replace('"Amlodipine Generic"', '"Norvasc", "Lodipine", "Alkadip", "Vasopin"')
                content = content.replace('"Diclofenac gel generic"', '"Voltaren Emulgel", "Olfen Gel", "Romafen Gel"')
                content = content.replace('"Cinnarizine generic"', '"Stugeron", "Cinnarizine El-Nasr"')
                
                data = json.loads(content)
                all_drugs.extend(data)
        except Exception as e:
            print(f"Error reading {f}: {e}")
    return json.dumps(all_drugs, ensure_ascii=False)

def generate_html(drugs_json):
    html_content = r"""<!DOCTYPE html>
<html lang="ar" dir="rtl" class="">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PharmaPocket EG</title>
    <!-- PWA / Standalone -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="PharmaPocket">
    <meta name="theme-color" content="#059669">
    <link rel="apple-touch-icon" href="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Crect%20fill%3D%27%23059669%27%20width%3D%27100%27%20height%3D%27100%27%20rx%3D%2720%27%2F%3E%3Cpath%20d%3D%27M50%2020%20L50%2080%20M20%2050%20L80%2050%27%20stroke%3D%27white%27%20stroke-width%3D%2715%27%2F%3E%3C%2Fsvg%3E">
    <link rel="manifest" href="data:application/manifest+json;charset=utf-8,%7B%22name%22%3A%22PharmaPocket%20EG%22%2C%22short_name%22%3A%22PharmaPocket%22%2C%22start_url%22%3A%22.%22%2C%22display%22%3A%22standalone%22%2C%22background_color%22%3A%22%23ffffff%22%2C%22theme_color%22%3A%22%23059669%22%2C%22icons%22%3A%5B%7B%22src%22%3A%22data%3Aimage%2Fsvg%2Bxml%3Bcharset%3Dutf-8%2C%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Crect%20fill%3D%27%23059669%27%20width%3D%27100%27%20height%3D%27100%27%20rx%3D%2720%27%2F%3E%3Cpath%20d%3D%27M50%2020%20L50%2080%20M20%2050%20L80%2050%27%20stroke%3D%27white%27%20stroke-width%3D%2715%27%2F%3E%3C%2Fsvg%3E%22%2C%22sizes%22%3A%22192x192%22%2C%22type%22%3A%22image%2Fsvg%2Bxml%22%2C%22purpose%22%3A%22any%20maskable%22%7D%2C%7B%22src%22%3A%22data%3Aimage%2Fsvg%2Bxml%3Bcharset%3Dutf-8%2C%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Crect%20fill%3D%27%23059669%27%20width%3D%27100%27%20height%3D%27100%27%20rx%3D%2720%27%2F%3E%3Cpath%20d%3D%27M50%2020%20L50%2080%20M20%2050%20L80%2050%27%20stroke%3D%27white%27%20stroke-width%3D%2715%27%2F%3E%3C%2Fsvg%3E%22%2C%22sizes%22%3A%22512x512%22%2C%22type%22%3A%22image%2Fsvg%2Bxml%22%2C%22purpose%22%3A%22any%20maskable%22%7D%5D%7D">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'medical-slate': '#0f172a',
                        'clinical-emerald': '#059669',
                        'cyan-accent': '#0891b2',
                    }
                }
            }
        }
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        /* Hide scrollbar for clean UI */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .nav-btn.active { 
            color: #059669; 
            border-bottom: 2px solid #059669; 
        }
        .dark .nav-btn.active {
            color: #10b981;
            border-bottom-color: #10b981;
        }
        
        @media (min-width: 768px) {
            .nav-btn.active { 
                border-bottom: none; 
                border-left: 3px solid #059669; 
                background-color: #f1f5f9; 
            }
            .dark .nav-btn.active {
                border-left-color: #10b981;
                background-color: #1e293b;
            }
        }
        
        .chip { cursor: pointer; transition: all 0.2s; }
        .chip.active { background-color: #059669; color: white; border-color: #059669; }
        .dark .chip.active { background-color: #10b981; border-color: #10b981; }
        
        /* 3D Flip Card */
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; transition: transform 0.6s; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .flashcard.flipped .transform-style-3d { transform: rotateY(180deg); }
        
        /* Highlighting Search Matches */
        mark.search-highlight {
            background-color: #fef08a; /* yellow-200 */
            color: #1e293b; /* slate-800 */
            border-radius: 0.125rem;
            padding: 0 0.125rem;
        }
        .dark mark.search-highlight {
            background-color: #ca8a04; /* yellow-600 */
            color: #ffffff;
        }
    </style>
</head>
<body class="h-screen w-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

    <!-- Sidebar (Desktop) -->
    <aside class="hidden md:flex flex-col w-64 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 justify-between">
        <div class="flex flex-col flex-1 h-full overflow-hidden">
            <div class="p-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <i data-lucide="cross" class="text-clinical-emerald dark:text-emerald-500 w-8 h-8"></i>
                <h1 class="text-xl font-bold text-clinical-emerald dark:text-emerald-500">PharmaPocket</h1>
            </div>
            <nav class="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
                <button class="nav-btn active flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-directory">
                    <i data-lucide="library" class="w-5 h-5"></i><span class="font-medium">الدليل الشامل</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-shelf">
                    <i data-lucide="layers" class="w-5 h-5"></i><span class="font-medium">رفوف الصيدلية</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-index">
                    <i data-lucide="book-open" class="w-5 h-5"></i><span class="font-medium">المواد الفعالة</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-calc">
                    <i data-lucide="calculator" class="w-5 h-5"></i><span class="font-medium">حاسبة الأطفال</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-triage">
                    <i data-lucide="stethoscope" class="w-5 h-5"></i><span class="font-medium">OTC و أجهزة</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-rx">
                    <i data-lucide="scroll-text" class="w-5 h-5"></i><span class="font-medium">مترجم الروشتات</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-clinical-emerald dark:hover:text-emerald-400 transition-colors w-full text-right" data-tab="tab-flashcards">
                    <i data-lucide="zap" class="w-5 h-5"></i><span class="font-medium">تريكة الصيدلي</span>
                </button>
                <button class="nav-btn flex items-center gap-3 p-4 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors w-full text-right bg-rose-50/50 dark:bg-rose-950/20" data-tab="tab-interview">
                    <i data-lucide="shield-alert" class="w-5 h-5 text-rose-500"></i><span class="font-medium text-rose-600 dark:text-rose-400">فخاخ الإنترفيو (Traps)</span>
                </button>
            </nav>
        </div>
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <button onclick="toggleDarkMode()" class="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                <i data-lucide="moon" class="w-5 h-5 dark:hidden"></i>
                <i data-lucide="sun" class="w-5 h-5 hidden dark:block text-yellow-400"></i>
                <span>تبديل المظهر</span>
            </button>
        </div>
    </aside>

    <!-- Bottom Navigation (Mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around pb-safe">
        <button class="nav-btn active flex flex-col items-center gap-1 p-3 text-slate-500 dark:text-slate-400 w-full" data-tab="tab-directory">
            <i data-lucide="library" class="w-6 h-6"></i><span class="text-xs font-medium">الدليل</span>
        </button>
        <button class="nav-btn flex flex-col items-center gap-1 p-3 text-slate-500 dark:text-slate-400 w-full" data-tab="tab-shelf">
            <i data-lucide="layers" class="w-6 h-6"></i><span class="text-xs font-medium">الرفوف</span>
        </button>
        <button class="nav-btn flex flex-col items-center gap-1 p-3 text-slate-500 dark:text-slate-400 w-full" data-tab="tab-index">
            <i data-lucide="book-open" class="w-6 h-6"></i><span class="text-xs font-medium">المواد</span>
        </button>
        <button class="nav-btn flex flex-col items-center gap-1 p-3 text-slate-500 dark:text-slate-400 w-full" data-tab="tab-calc">
            <i data-lucide="calculator" class="w-6 h-6"></i><span class="text-xs font-medium">حاسبة</span>
        </button>
        <button class="nav-btn flex flex-col items-center gap-1 p-3 text-slate-500 dark:text-slate-400 w-full" onclick="toggleMobileMenu()">
            <i data-lucide="menu" class="w-6 h-6"></i><span class="text-xs font-medium">المزيد</span>
        </button>
    </nav>
    
    <!-- Mobile Extra Menu Overlay -->
    <div id="mobileMenu" class="fixed inset-0 bg-black/50 z-50 hidden" onclick="toggleMobileMenu()">
        <div class="absolute bottom-20 right-4 left-4 bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-2xl border dark:border-slate-700" onclick="event.stopPropagation()">
            <button class="nav-btn flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 w-full rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700" data-tab="tab-triage" onclick="toggleMobileMenu()">
                <i data-lucide="stethoscope" class="w-5 h-5 text-clinical-emerald dark:text-emerald-500"></i> <span class="font-medium">OTC و أجهزة</span>
            </button>
            <button class="nav-btn flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 w-full rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700" data-tab="tab-rx" onclick="toggleMobileMenu()">
                <i data-lucide="scroll-text" class="w-5 h-5 text-clinical-emerald dark:text-emerald-500"></i> <span class="font-medium">مترجم الروشتات</span>
            </button>
            <button class="nav-btn flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 w-full rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700" data-tab="tab-flashcards" onclick="toggleMobileMenu()">
                <i data-lucide="zap" class="w-5 h-5 text-clinical-emerald dark:text-emerald-500"></i> <span class="font-medium">تريكة الصيدلي (فلاش كاردز)</span>
            </button>
            <button class="nav-btn flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 w-full rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30" data-tab="tab-interview" onclick="toggleMobileMenu()">
                <i data-lucide="shield-alert" class="w-5 h-5 text-rose-500"></i> <span class="font-medium text-rose-600 dark:text-rose-400">فخاخ الإنترفيو</span>
            </button>
            <hr class="dark:border-slate-700 my-1">
            <button onclick="toggleDarkMode(); toggleMobileMenu();" class="flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 w-full rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                <i data-lucide="moon" class="w-5 h-5 dark:hidden text-slate-600"></i>
                <i data-lucide="sun" class="w-5 h-5 hidden dark:block text-yellow-400"></i>
                <span class="font-medium">تغيير المظهر (Dark/Light)</span>
            </button>
        </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full w-full overflow-hidden relative">
        
        <!-- Top Header (Pinned) -->
        <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-20 shrink-0">
            <div class="max-w-7xl mx-auto flex flex-col gap-3">
                <div class="flex items-center gap-2 md:hidden mb-1">
                    <i data-lucide="cross" class="text-clinical-emerald dark:text-emerald-500 w-6 h-6"></i>
                    <h1 class="text-lg font-bold text-clinical-emerald dark:text-emerald-500">PharmaPocket EG</h1>
                </div>
                
                <div class="relative">
                    <i data-lucide="search" class="absolute right-3 top-3 text-slate-400 w-5 h-5"></i>
                    <input type="text" id="searchInput" placeholder="ابحث بالاسم، المادة الفعالة، الاستخدام، أو الكلمات الدلالية..." 
                           class="w-full bg-slate-100 dark:bg-slate-800 dark:text-white rounded-lg py-2.5 pr-10 pl-4 border border-transparent focus:border-clinical-emerald dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors shadow-inner">
                </div>
                
                <div class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar" id="filterChips">
                    <button class="chip active px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="الكل">الكل</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="أطفال">أطفال</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="مسكنات">مسكنات</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="جهاز هضمي">جهاز هضمي</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="جهاز تنفسي">جهاز تنفسي</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="ضغط وقلب">ضغط وقلب</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="سكر ودهون">سكر ودهون</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="حقن وطوارئ">حقن وطوارئ</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="موضعي وعيون">موضعي وعيون</button>
                    <button class="chip px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" data-filter="أسنان وفطريات">أسنان وفطريات</button>
                </div>
            </div>
        </header>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 pb-24 md:pb-6 relative" id="mainScrollable">
            <div class="max-w-7xl mx-auto w-full">
                
                <!-- Tab 1: Smart Drug Directory -->
                <div id="tab-directory" class="tab-content active">
                    <div id="drugsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <!-- Drug cards rendered here -->
                    </div>
                    <div id="noResults" class="hidden text-center py-16 text-slate-500 dark:text-slate-400">
                        <i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                        <p class="text-lg">لا توجد نتائج مطابقة للبحث أو الفلتر الحالي</p>
                    </div>
                </div>

                <!-- Tab 2: Shelf View -->
                <div id="tab-shelf" class="tab-content">
                    <h2 class="text-2xl font-bold mb-6 text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="layers" class="text-clinical-emerald dark:text-emerald-500"></i> رفوف الصيدلية</h2>
                    <div class="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar" id="shelfCategories">
                        <!-- Categories populated via JS -->
                    </div>
                    <div id="shelfGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        <!-- Shelf items rendered here -->
                    </div>
                </div>

                <!-- Tab 3: Active Ingredient Index -->
                <div id="tab-index" class="tab-content">
                    <h2 class="text-2xl font-bold mb-6 text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="book-open" class="text-clinical-emerald dark:text-emerald-500"></i> فهرس المواد الفعالة</h2>
                    <div class="relative mb-6 max-w-2xl">
                        <i data-lucide="search" class="absolute right-3 top-3 text-slate-400 w-5 h-5"></i>
                        <input type="text" id="ingredientSearch" placeholder="ابحث عن مادة فعالة (مثال: Paracetamol)..." class="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg py-2.5 pr-10 pl-4 border border-slate-200 dark:border-slate-700 focus:border-clinical-emerald dark:focus:border-emerald-500 focus:outline-none shadow-sm">
                    </div>
                    <div id="ingredientList" class="flex flex-col gap-3 max-w-4xl">
                        <!-- Ingredients rendered here -->
                    </div>
                </div>

                <!-- Tab 4: Pediatric Dose Calc -->
                <div id="tab-calc" class="tab-content">
                    <div class="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 class="text-xl font-bold mb-6 text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="calculator" class="text-clinical-emerald dark:text-emerald-500"></i> حاسبة جرعات الأطفال</h2>
                        
                        <div class="mb-5">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">وزن الطفل (كجم)</label>
                            <input type="number" id="calcWeight" placeholder="مثال: 12" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:border-clinical-emerald dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-lg dark:text-white transition-colors" oninput="calculateDose()">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">اختر الدواء</label>
                            <select id="calcDrug" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:border-clinical-emerald dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-lg dark:text-white transition-colors" onchange="calculateDose()">
                                <option value="">-- اختر الدواء --</option>
                                <option value="paracetamol_120">سيتال / بارامول (Paracetamol 120mg/5ml)</option>
                                <option value="paracetamol_250">ميجافين / أدول فورت (Paracetamol 250mg/5ml)</option>
                                <option value="ibuprofen_100">بروفين (Ibuprofen 100mg/5ml)</option>
                                <option value="augmentin_228">أوجمنتين 228 (Amox/Clav 228mg/5ml)</option>
                                <option value="augmentin_457">أوجمنتين 457 (Amox/Clav 457mg/5ml)</option>
                                <option value="azithro_200">زيثروماكس (Azithromycin 200mg/5ml)</option>
                                <option value="cefixime_100">سيفيكس / دينفار (Cefixime 100mg/5ml)</option>
                            </select>
                        </div>
                        
                        <div id="calcResult" class="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6 transition-all">
                            <div class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 p-5 rounded-xl text-center border border-emerald-100 dark:border-emerald-800">
                                <div class="text-sm mb-2 opacity-80">الجرعة المقترحة في المرة الواحدة:</div>
                                <div class="text-4xl font-bold mb-3 font-mono" id="calcDoseText">-</div>
                                <div class="text-sm font-medium bg-white/50 dark:bg-black/20 py-2 rounded-lg" id="calcFreqText">-</div>
                            </div>
                            <div id="calcWarning" class="mt-4 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                                <i data-lucide="alert-triangle" class="w-5 h-5 shrink-0"></i>
                                <span id="calcWarningText" class="leading-relaxed">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 5: OTC Protocols & Devices -->
                <div id="tab-triage" class="tab-content">
                    <h2 class="text-2xl font-bold mb-6 text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="stethoscope" class="text-clinical-emerald dark:text-emerald-500"></i> OTC والأجهزة والمستلزمات</h2>
                    <div id="otcGrid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <!-- Dynamically populated from IDs 251-300 -->
                    </div>
                </div>

                <!-- Tab 6: Rx Decoder & LASA -->
                <div id="tab-rx" class="tab-content">
                    <h2 class="text-2xl font-bold mb-6 text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="scroll-text" class="text-clinical-emerald dark:text-emerald-500"></i> مترجم الروشتات (Abbreviations & LASA)</h2>
                    
                    <div class="grid lg:grid-cols-2 gap-8">
                        <!-- Abbreviations -->
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                                <i data-lucide="languages" class="w-5 h-5 text-cyan-accent dark:text-cyan-400"></i> اختصارات الروشتة اللاتينية
                            </h3>
                            <div class="overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                <table class="w-full text-sm text-right">
                                    <thead><tr class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 rounded-t-lg"><th class="p-3">الاختصار</th><th class="p-3">المعنى اللاتيني</th><th class="p-3">الترجمة</th></tr></thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-clinical-emerald dark:text-emerald-400">OD</td><td class="p-3 dark:text-slate-300">Omne in die</td><td class="p-3 font-medium dark:text-slate-200">مرة واحدة يومياً</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-clinical-emerald dark:text-emerald-400">BID / BD</td><td class="p-3 dark:text-slate-300">Bis in die</td><td class="p-3 font-medium dark:text-slate-200">مرتين يومياً</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-clinical-emerald dark:text-emerald-400">TID / TDS</td><td class="p-3 dark:text-slate-300">Ter in die</td><td class="p-3 font-medium dark:text-slate-200">٣ مرات يومياً</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-clinical-emerald dark:text-emerald-400">QID</td><td class="p-3 dark:text-slate-300">Quater in die</td><td class="p-3 font-medium dark:text-slate-200">٤ مرات يومياً</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-cyan-accent dark:text-cyan-400">AC</td><td class="p-3 dark:text-slate-300">Ante cibum</td><td class="p-3 font-medium dark:text-slate-200">قبل الأكل</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-cyan-accent dark:text-cyan-400">PC</td><td class="p-3 dark:text-slate-300">Post cibum</td><td class="p-3 font-medium dark:text-slate-200">بعد الأكل</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-amber-500 dark:text-amber-400">PRN / SOS</td><td class="p-3 dark:text-slate-300">Pro re nata</td><td class="p-3 font-medium dark:text-slate-200">عند اللزوم</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-rose-500 dark:text-rose-400">STAT</td><td class="p-3 dark:text-slate-300">Statim</td><td class="p-3 font-medium dark:text-slate-200">فوراً / حالاً (طوارئ)</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-slate-600 dark:text-slate-400">PO</td><td class="p-3 dark:text-slate-300">Per os</td><td class="p-3 font-medium dark:text-slate-200">عن طريق الفم</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-slate-600 dark:text-slate-400">IV / IM</td><td class="p-3 dark:text-slate-300">Intravenous/muscular</td><td class="p-3 font-medium dark:text-slate-200">وريد / عضل</td></tr>
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"><td class="p-3 font-mono font-bold text-indigo-500 dark:text-indigo-400">HS</td><td class="p-3 dark:text-slate-300">Hora somni</td><td class="p-3 font-medium dark:text-slate-200">وقت النوم</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- LASA -->
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                                <i data-lucide="alert-circle" class="w-5 h-5 text-rose-500"></i> أدوية متشابهة (LASA)
                            </h3>
                            <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/50">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-bold text-lg text-rose-700 dark:text-rose-400 tracking-wider">Amoxil</span>
                                        <i data-lucide="arrow-left-right" class="w-5 h-5 text-slate-400 dark:text-slate-500"></i>
                                        <span class="font-bold text-lg text-blue-700 dark:text-blue-400 tracking-wider">Amaryl</span>
                                    </div>
                                    <div class="flex justify-between text-xs font-medium px-2">
                                        <span class="text-rose-600 dark:text-rose-300">مضاد حيوي</span>
                                        <span class="text-blue-600 dark:text-blue-300">دواء سكر خطير</span>
                                    </div>
                                </div>
                                <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/50">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-bold text-lg text-rose-700 dark:text-rose-400 tracking-wider">Zantac</span>
                                        <i data-lucide="arrow-left-right" class="w-5 h-5 text-slate-400 dark:text-slate-500"></i>
                                        <span class="font-bold text-lg text-blue-700 dark:text-blue-400 tracking-wider">Zyrtec</span>
                                    </div>
                                    <div class="flex justify-between text-xs font-medium px-2">
                                        <span class="text-rose-600 dark:text-rose-300">حموضة ومعدة</span>
                                        <span class="text-blue-600 dark:text-blue-300">حساسية</span>
                                    </div>
                                </div>
                                <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/50">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-bold text-lg text-rose-700 dark:text-rose-400 tracking-wider">Tegretol</span>
                                        <i data-lucide="arrow-left-right" class="w-5 h-5 text-slate-400 dark:text-slate-500"></i>
                                        <span class="font-bold text-lg text-blue-700 dark:text-blue-400 tracking-wider">Trental</span>
                                    </div>
                                    <div class="flex justify-between text-xs font-medium px-2">
                                        <span class="text-rose-600 dark:text-rose-300">أعصاب وصرع</span>
                                        <span class="text-blue-600 dark:text-blue-300">دورة دموية</span>
                                    </div>
                                </div>
                                <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/50">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-bold text-lg text-rose-700 dark:text-rose-400 tracking-wider">Daflon</span>
                                        <i data-lucide="arrow-left-right" class="w-5 h-5 text-slate-400 dark:text-slate-500"></i>
                                        <span class="font-bold text-lg text-blue-700 dark:text-blue-400 tracking-wider">Delfen</span>
                                    </div>
                                    <div class="flex justify-between text-xs font-medium px-2">
                                        <span class="text-rose-600 dark:text-rose-300">بواسير وأوردة</span>
                                        <span class="text-blue-600 dark:text-blue-300">منع حمل (مهبلي)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 7: Interactive Flashcards -->
                <div id="tab-flashcards" class="tab-content h-full">
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-2xl font-bold text-medical-slate dark:text-white flex items-center gap-2"><i data-lucide="zap" class="text-clinical-emerald dark:text-emerald-500"></i> فلاش كاردز (تريكة الصيدلي)</h2>
                        <div class="text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm text-slate-700 dark:text-slate-200">أتقنت: <span id="fcProgress" class="text-clinical-emerald dark:text-emerald-400 text-lg">0</span> / <span id="fcTotal">0</span></div>
                    </div>
                    
                    <div class="flex flex-col items-center justify-center min-h-[500px]">
                        <div id="flashcardContainer" class="w-full max-w-sm aspect-[3/4] perspective-1000 cursor-pointer flashcard" onclick="this.classList.toggle('flipped')">
                            <!-- Dynamic Card Content -->
                            <div class="w-full h-full relative transform-style-3d shadow-2xl rounded-3xl">
                                <!-- Front -->
                                <div class="absolute inset-0 backface-hidden bg-gradient-to-br from-clinical-emerald to-teal-900 dark:from-emerald-700 dark:to-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center border-4 border-white dark:border-slate-800">
                                    <i data-lucide="help-circle" class="w-20 h-20 opacity-30 mb-6"></i>
                                    <h3 class="text-4xl font-bold mb-3 drop-shadow-md" id="fcFrontName">-</h3>
                                    <p class="text-emerald-100 dark:text-emerald-200 text-xl font-medium" id="fcFrontForm">-</p>
                                    <div class="mt-12 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium animate-pulse">اضغط لقلب البطاقة وكشف التريكة</div>
                                </div>
                                <!-- Back -->
                                <div class="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-800 border-4 border-clinical-emerald dark:border-emerald-500 rounded-3xl p-6 flex flex-col text-right overflow-y-auto custom-scrollbar">
                                    <h4 class="text-sm text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-wider">المادة الفعالة:</h4>
                                    <p class="text-lg font-bold text-slate-800 dark:text-white mb-4" id="fcBackActive">-</p>
                                    
                                    <h4 class="text-sm text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-wider">الاستخدام السريع:</h4>
                                    <p class="text-md font-medium text-slate-700 dark:text-slate-300 mb-5" id="fcBackIndication">-</p>
                                    
                                    <h4 class="text-sm text-slate-400 dark:text-slate-500 font-bold mb-2 uppercase tracking-wider flex items-center gap-1"><i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i> التريكة السريرية (Clinical Pearl):</h4>
                                    <div class="text-md text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 leading-relaxed font-medium" id="fcBackPearl">-</div>
                                    
                                    <div class="mt-auto flex justify-between gap-3 pt-6">
                                        <button onclick="event.stopPropagation(); markFlashcard(false)" class="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex justify-center items-center gap-2 shadow-sm"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> محتاجة مراجعة</button>
                                        <button onclick="event.stopPropagation(); markFlashcard(true)" class="flex-1 py-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2 shadow-sm"><i data-lucide="check-circle-2" class="w-4 h-4"></i> أتقنتها</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 8: Interview Simulator -->
                <div id="tab-interview" class="tab-content">
                    <div class="mb-6 flex justify-between items-center flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i data-lucide="shield-alert" class="text-rose-500 w-7 h-7"></i>
                                بنك أسئلة الإنترفيو وسيناريوهات الكاونتر الحرجة
                            </h2>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">الأسئلة الأكثر تكراراً لتقييم الأمان الدوائي وفخاخ الصرف للسلاسل</p>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900">Red Flags الإلزامية</span>
                            <span class="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900">Cross-Selling الاحترافي</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="interviewCasesContainer">
                        <!-- Cases populated via JS -->
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- Embedded Data & App Logic -->
    <script>
        const DRUGS_DATA = {drugs_json};
        
        // State
        let currentFilter = 'الكل';
        let searchQuery = '';
        let flashcardIndex = 0;
        let masteredCards = JSON.parse(localStorage.getItem('pharmaMastered') || '[]');
        let currentFlashcards = [];

        // Initialize App
        function initApp() {
            initDarkMode();
            lucide.createIcons();
            renderDirectory();
            renderShelfCategories();
            renderIngredients();
            renderOTC();
            initFlashcards();
            renderInterviewCases();
            setupEventListeners();
            
            // Service Worker for PWA
            if ('serviceWorker' in navigator) {
                const swCode = `
                    self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
                    self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
                    self.addEventListener('fetch', e => {});
                `;
                const blob = new Blob([swCode], {type: 'application/javascript'});
                const swUrl = URL.createObjectURL(blob);
                navigator.serviceWorker.register(swUrl).catch(err => console.log('SW Reg Failed', err));
            }
        }

        // Dark Mode
        function initDarkMode() {
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        function toggleDarkMode() {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }
        
        // Highlight Matches Helper
        function highlightMatch(text, query) {
            if (!query || !text) return text || '';
            const words = query.trim().split(/\s+/).filter(w => w.length > 1);
            if (words.length === 0) return text;
            
            let highlighted = String(text);
            words.forEach(w => {
                const escapedQuery = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
            });
            return highlighted;
        }

        // Filter Logic Updated
        function filterDrugs() {
            const query = searchQuery.trim().toLowerCase();
            const activeChip = currentFilter;

            const filtered = DRUGS_DATA.filter(drug => {
                if (drug.id >= 251 && activeChip === 'الكل') return false; // Exclude devices/OTC/protocols from main drug view

                // Search Matching
                const matchesQuery = !query || 
                    (drug.trade_name && drug.trade_name.toLowerCase().includes(query)) ||
                    (drug.name_ar && drug.name_ar.includes(query)) ||
                    (drug.active_ingredient && drug.active_ingredient.toLowerCase().includes(query)) ||
                    (drug.indications && drug.indications.includes(query)) ||
                    (drug.clinical_pearl && drug.clinical_pearl.includes(query));

                // Category Matching
                let matchesCategory = false;
                const sysCat = (drug.system_category || '').toLowerCase();
                const formCat = (drug.dosage_form || '').toLowerCase();
                const subForm = (drug.sub_form_type || '').toLowerCase();

                if (activeChip === 'الكل') {
                    matchesCategory = true;
                } else if (activeChip === 'أطفال') {
                    matchesCategory = sysCat.includes('أطفال') || formCat === 'oral drops' || subForm.includes('أطفال');
                } else if (activeChip === 'مسكنات') {
                    matchesCategory = sysCat.includes('مسكنات') || subForm.includes('مسكن') || subForm.includes('nsaid');
                } else if (activeChip === 'حقن وطوارئ') {
                    matchesCategory = sysCat.includes('طوارئ') || formCat === 'ampoule' || formCat === 'vial';
                } else if (activeChip === 'موضعي وعيون') {
                    matchesCategory = sysCat.includes('جلدية') || sysCat.includes('عيون') || ['cream', 'ointment', 'gel', 'eye drops', 'ear drops', 'topical solution'].includes(formCat);
                } else if (activeChip === 'أسنان وفطريات') {
                    matchesCategory = sysCat.includes('أسنان') || sysCat.includes('فطريات');
                } else {
                    matchesCategory = sysCat.includes(activeChip);
                }

                return matchesQuery && matchesCategory;
            });

            renderDrugsGrid(filtered);
        }

        // Setup Event Listeners
        function setupEventListeners() {
            let searchTimeout;
            document.getElementById('searchInput').addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    searchQuery = e.target.value;
                    filterDrugs();
                }, 150);
            });

            // Tabs
            document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    const tabId = btn.getAttribute('data-tab');
                    document.querySelectorAll(`.nav-btn[data-tab="${tabId}"]`).forEach(b => b.classList.add('active'));
                    
                    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                    document.getElementById(tabId).classList.add('active');
                    
                    document.getElementById('mainScrollable').scrollTop = 0;
                });
            });

            // Chips Filter
            document.querySelectorAll('.chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    currentFilter = chip.getAttribute('data-filter');
                    
                    // Switch to directory tab if not on it
                    document.querySelector('.nav-btn[data-tab="tab-directory"]').click();
                    
                    filterDrugs();
                });
            });

            // Ingredient Search
            document.getElementById('ingredientSearch').addEventListener('input', (e) => {
                renderIngredients(e.target.value);
            });
        }

        // Toggle Mobile Menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function formatSubstitutes(subs) {
            if (!subs || !Array.isArray(subs)) return '<span class="text-xs text-slate-400">لا توجد بدائل مباشرة مسجلة</span>';
            const cleanSubs = subs.filter(s => s && !s.toLowerCase().includes('generic') && s !== '-');
            if (cleanSubs.length === 0) return '<span class="text-xs text-slate-400">لا توجد بدائل مباشرة مسجلة</span>';
            return cleanSubs.map(s => `<span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded text-xs ml-1 mb-1 border border-slate-200 dark:border-slate-600">${s}</span>`).join('');
        }

        function renderDirectory() {
            filterDrugs();
        }

        // Main Directory Rendering
        function renderDrugsGrid(filtered) {
            const grid = document.getElementById('drugsGrid');
            const noResults = document.getElementById('noResults');
            
            const query = searchQuery.trim().toLowerCase();

            if (filtered.length === 0) {
                grid.innerHTML = '';
                noResults.classList.remove('hidden');
                return;
            }
            
            noResults.classList.add('hidden');
            
            grid.innerHTML = filtered.map(drug => `
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50 group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/10 transition-colors">
                        <div>
                            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-1">${highlightMatch(drug.name_ar || drug.trade_name, query)}</h3>
                            <div class="text-sm text-slate-500 dark:text-slate-400 font-mono font-medium tracking-wide">${highlightMatch(drug.trade_name, query)}</div>
                        </div>
                        <div class="flex gap-1.5 flex-col items-end shrink-0 pl-2">
                            <span class="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md whitespace-nowrap">${drug.dosage_form || 'عام'}</span>
                            ${drug.is_fridge ? '<span class="text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap" title="يحفظ بالثلاجة"><i data-lucide="snowflake" class="w-3 h-3"></i> ثلاجة</span>' : ''}
                            ${drug.special_populations?.pregnancy === 'Contraindicated' || drug.special_populations?.pregnancy === 'Contraindicated (T1)' || drug.special_populations?.pregnancy === 'Contraindicated (T3)' ? '<span class="text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap"><i data-lucide="alert-triangle" class="w-3 h-3"></i> يمنع للحامل</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="p-4 flex-1 flex flex-col gap-3">
                        <div>
                            <span class="text-xs text-clinical-emerald dark:text-emerald-400 font-bold block mb-1 uppercase tracking-wide">المادة الفعالة:</span>
                            <div class="text-sm font-medium text-slate-800 dark:text-slate-200" onclick="selectIngredient('${drug.active_ingredient.replace(/'/g, "\\'")}')" style="cursor: pointer; text-decoration: underline; text-decoration-style: dotted;">${highlightMatch(drug.active_ingredient || 'غير محدد', query)}</div>
                        </div>
                        <div>
                            <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">دواعي الاستعمال:</span>
                            <div class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${highlightMatch(drug.indications || 'غير محدد', query)}</div>
                        </div>
                        
                        ${drug.clinical_pearl ? `
                        <div class="mt-auto pt-3">
                            <div class="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-400 dark:border-amber-500 p-3 rounded-l-lg">
                                <span class="text-xs text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1.5 mb-1.5"><i data-lucide="lightbulb" class="w-4 h-4"></i> تريكة الصيدلي:</span>
                                <div class="text-sm font-medium text-amber-900 dark:text-amber-200 leading-relaxed">${highlightMatch(drug.clinical_pearl, query)}</div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-3 text-xs border-t border-slate-100 dark:border-slate-700">
                        <div class="text-slate-500 dark:text-slate-400 font-bold mb-1">بدائل:</div>
                        <div class="flex flex-wrap">${formatSubstitutes(drug.substitutes_same_active)}</div>
                    </div>
                </div>
            `).join('');
            
            lucide.createIcons();
        }

        // Dynamic OTC rendering from ID >= 251
        function renderOTC() {
            const grid = document.getElementById('otcGrid');
            const otcItems = DRUGS_DATA.filter(d => (d.id >= 251 && d.id <= 300) || (d.system_category && d.system_category.includes('أجهزة')));
            
            if (otcItems.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center p-10 text-slate-500">جاري تحميل بروتوكولات الأدوية...</div>';
                return;
            }
            
            grid.innerHTML = otcItems.map(drug => `
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                    <div class="bg-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-50 dark:bg-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-900/30 p-4 border-b border-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 class="font-bold text-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-800 dark:text-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-300 text-lg">${drug.name_ar || drug.trade_name}</h3>
                        <span class="text-xs bg-white/50 dark:bg-black/20 text-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-800 dark:text-${drug.id % 2 === 0 ? 'rose' : 'indigo'}-200 px-2.5 py-1 rounded-full font-bold">${drug.sub_form_type || 'مستلزم'}</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col gap-4 text-sm">
                        <div>
                            <strong class="text-slate-800 dark:text-slate-200 block mb-2 font-bold"><i data-lucide="check-circle-2" class="w-4 h-4 inline text-emerald-500 ml-1"></i> دواعي الاستعمال:</strong>
                            <p class="text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-r-2 border-emerald-400">${drug.indications}</p>
                        </div>
                        <div>
                            <strong class="text-slate-800 dark:text-slate-200 block mb-2 font-bold"><i data-lucide="list" class="w-4 h-4 inline text-blue-500 ml-1"></i> طريقة الاستخدام (Protocol):</strong>
                            <p class="text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-r-2 border-blue-400">${drug.dosage_and_admin}</p>
                        </div>
                        ${drug.clinical_pearl ? `
                        <div>
                            <strong class="text-slate-800 dark:text-slate-200 block mb-2 font-bold"><i data-lucide="lightbulb" class="w-4 h-4 inline text-amber-500 ml-1"></i> معلومة هامة:</strong>
                            <p class="text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-r-2 border-amber-400">${drug.clinical_pearl}</p>
                        </div>
                        ` : ''}
                        ${drug.critical_warnings ? `
                        <div class="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                            <div class="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg flex items-start gap-2 border border-rose-100 dark:border-rose-800">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"></i>
                                <div>
                                    <strong class="text-rose-800 dark:text-rose-300 block mb-1">Red Flags (تحذير):</strong>
                                    <p class="text-rose-600 dark:text-rose-400 text-xs font-medium leading-relaxed">${drug.critical_warnings}</p>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }

        // Shelf View Grouping
        function renderShelfCategories() {
            const forms = [
                { id: 'all', name: 'الكل', icon: 'layers' },
                { id: 'syrup', name: 'أشربة ونقط', icon: 'flask-conical' },
                { id: 'tablet', name: 'أقراص وكبسول', icon: 'pill' },
                { id: 'injection', name: 'حقن', icon: 'syringe' },
                { id: 'topical', name: 'موضعي (كريم/قطرات)', icon: 'hand' },
                { id: 'fridge', name: 'ثلاجة', icon: 'snowflake' },
                { id: 'device', name: 'أجهزة ومستلزمات', icon: 'package' }
            ];
            
            const container = document.getElementById('shelfCategories');
            
            container.innerHTML = forms.map(f => `
                <button class="px-4 py-2 ${f.id === 'all' ? 'bg-clinical-emerald text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'} rounded-xl text-sm font-bold shelf-cat-btn transition-colors whitespace-nowrap flex items-center gap-2 shadow-sm hover:border-clinical-emerald" data-cat="${f.id}">
                    <i data-lucide="${f.icon}" class="w-4 h-4"></i> ${f.name}
                </button>
            `).join('');
                
            document.querySelectorAll('.shelf-cat-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    document.querySelectorAll('.shelf-cat-btn').forEach(b => { 
                        b.classList.remove('bg-clinical-emerald', 'text-white'); 
                        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200'); 
                    });
                    target.classList.add('bg-clinical-emerald', 'text-white');
                    target.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
                    renderShelfGrid(target.getAttribute('data-cat'));
                });
            });
            
            renderShelfGrid('all');
        }
        
        function renderShelfGrid(category) {
            const grid = document.getElementById('shelfGrid');
            
            const items = DRUGS_DATA.filter(d => {
                if (d.id >= 339) return false; // exclude interview traps from shelf
                if (category === 'all') return true;
                if (category === 'fridge') return d.is_fridge;
                if (category === 'device') return d.id >= 251 && d.id <= 300;
                
                const form = (d.dosage_form || '').toLowerCase();
                if (category === 'syrup') return form.includes('syrup') || form.includes('susp') || form.includes('drop');
                if (category === 'tablet') return form.includes('tab') || form.includes('cap');
                if (category === 'injection') return form.includes('amp') || form.includes('vial') || form.includes('inj');
                if (category === 'topical') return form.includes('cream') || form.includes('oint') || form.includes('gel') || form.includes('spray') || form.includes('lotion');
                return false;
            });
            
            grid.innerHTML = items.map(drug => `
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center cursor-pointer hover:border-clinical-emerald dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all group" onclick="showDrugDetails(${drug.id})">
                    <div class="w-14 h-14 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-clinical-emerald dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                        ${getFormIcon(drug.dosage_form)}
                    </div>
                    <div class="font-bold text-sm text-slate-800 dark:text-white truncate" title="${drug.name_ar || drug.trade_name}">${drug.name_ar || drug.trade_name}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium truncate mt-1">${drug.trade_name}</div>
                </div>
            `).join('');
            lucide.createIcons();
        }

        function getFormIcon(form) {
            const f = (form || '').toLowerCase();
            if (f.includes('syrup') || f.includes('susp')) return '<i data-lucide="flask-conical" class="w-7 h-7"></i>';
            if (f.includes('tab') || f.includes('cap')) return '<i data-lucide="pill" class="w-7 h-7"></i>';
            if (f.includes('drop')) return '<i data-lucide="droplet" class="w-7 h-7"></i>';
            if (f.includes('cream') || f.includes('oint') || f.includes('gel')) return '<i data-lucide="hand" class="w-7 h-7"></i>';
            if (f.includes('amp') || f.includes('vial') || f.includes('inj')) return '<i data-lucide="syringe" class="w-7 h-7"></i>';
            if (f.includes('supp')) return '<i data-lucide="arrow-down-circle" class="w-7 h-7"></i>';
            if (f.includes('sachet')) return '<i data-lucide="package" class="w-7 h-7"></i>';
            if (f.includes('device') || f.includes('kit')) return '<i data-lucide="activity" class="w-7 h-7"></i>';
            return '<i data-lucide="box" class="w-7 h-7"></i>';
        }

        function showDrugDetails(id) {
            const drug = DRUGS_DATA.find(d => d.id === id);
            if (drug) {
                document.getElementById('searchInput').value = drug.trade_name;
                searchQuery = drug.trade_name.toLowerCase();
                currentFilter = 'الكل';
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                document.querySelector('.chip[data-filter="الكل"]')?.classList.add('active');
                
                document.querySelector('.nav-btn[data-tab="tab-directory"]').click();
                filterDrugs();
            }
        }

        // Select Ingredient from Tab 3 directly to Tab 1 Search
        function selectIngredient(ingName) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = ingName;
                searchQuery = ingName.toLowerCase();
            }
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            const dirBtn = document.querySelector('[data-tab="tab-directory"]');
            const dirTab = document.getElementById('tab-directory');
            if (dirBtn) dirBtn.classList.add('active');
            if (dirTab) dirTab.classList.add('active');
            
            document.querySelectorAll('#filterChips .chip').forEach(c => c.classList.remove('active'));
            document.querySelector('#filterChips .chip[data-filter="الكل"]')?.classList.add('active');
            currentFilter = 'الكل';
            
            filterDrugs();
            document.getElementById('mainScrollable').scrollTop = 0;
        }

        // Active Ingredients Index
        function renderIngredients(query = '') {
            const container = document.getElementById('ingredientList');
            const q = query.trim().toLowerCase();
            
            const grouped = {};
            DRUGS_DATA.forEach(d => {
                if (d.id >= 251) return; // Skip devices and protocols
                const act = d.active_ingredient || 'غير محدد';
                if (!grouped[act]) grouped[act] = [];
                grouped[act].push(d);
            });
            
            const sortedIngredients = Object.keys(grouped).sort();
            
            let html = '';
            sortedIngredients.forEach(ing => {
                if (q && !ing.toLowerCase().includes(q)) return;
                
                const drugs = grouped[ing];
                html += `
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <div class="p-4 font-bold text-slate-800 dark:text-white flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" onclick="selectIngredient('${ing.replace(/'/g, "\\'")}')">
                            <span class="text-sm md:text-base pr-4">${highlightMatch(ing, q)}</span>
                            <span class="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full font-bold whitespace-nowrap shadow-sm">${drugs.length} أدوية</span>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // Pediatric Dose Calc
        function calculateDose() {
            const weightInput = document.getElementById('calcWeight').value;
            const weight = parseFloat(weightInput);
            const drug = document.getElementById('calcDrug').value;
            const resDiv = document.getElementById('calcResult');
            const doseText = document.getElementById('calcDoseText');
            const freqText = document.getElementById('calcFreqText');
            const warnText = document.getElementById('calcWarningText');
            
            if (!weight || weight <= 0 || !drug) {
                // Hide or just show empty if invalid
                doseText.innerText = '-';
                freqText.innerText = '-';
                warnText.innerText = 'الرجاء إدخال الوزن واختيار الدواء بشكل صحيح.';
                return;
            }
            
            let dose = 0, freq = '', warn = '';
            
            switch(drug) {
                case 'paracetamol_120':
                    dose = weight * 0.625;
                    freq = 'كل 4 إلى 6 ساعات (أقصى 5 مرات يومياً)';
                    warn = 'يمنع تجاوز الجرعة اليومية القصوى لتفادي تسمم الكبد.';
                    break;
                case 'paracetamol_250':
                    dose = weight * 0.3;
                    freq = 'كل 4 إلى 6 ساعات (أقصى 5 مرات يومياً)';
                    warn = 'تركيز مضاعف (Forte)! احذر من الخلط بينه وبين تركيز 120 لعدم إعطاء جرعة مفرطة.';
                    break;
                case 'ibuprofen_100':
                    dose = weight * 0.5;
                    freq = 'كل 6 إلى 8 ساعات (أقصى 3 مرات)';
                    warn = 'يُعطى بعد الأكل مباشرة. يُمنع استخدامه في حالات الجفاف، الجدري المائي، للرضع أقل من 6 شهور (أو <5 كجم)، وفي حالة الربو التحسسي لمضادات الالتهاب.';
                    break;
                case 'augmentin_228':
                    dose = weight * (22.5 / 45.6);
                    freq = 'مرتين يومياً (كل 12 ساعة)';
                    warn = 'يُحفظ في الثلاجة بعد الحل وصالح لمدة 7 أيام فقط. يُفضل إعطاؤه مع بداية الوجبة لتقليل الإسهال.';
                    break;
                case 'augmentin_457':
                    dose = weight * (22.5 / 91.4);
                    freq = 'مرتين يومياً (كل 12 ساعة)';
                    warn = 'تركيز عالي! يُحفظ في الثلاجة بعد الحل وصالح 7 أيام فقط. يُعطى مع بداية الأكل.';
                    break;
                case 'azithro_200':
                    dose = weight * 0.25;
                    freq = 'مرة واحدة يومياً لمدة 3 أيام متتالية';
                    warn = 'يُعطى قبل الأكل بساعة أو بعد الأكل بساعتين لضمان الامتصاص الأمثل.';
                    break;
                case 'cefixime_100':
                    dose = weight * 0.4;
                    freq = 'مرة واحدة يومياً (أو مقسمة على مرتين)';
                    warn = 'يُرج جيداً قبل الاستخدام. آمن نسبياً على المعدة ويمكن إعطاؤه مع أو بدون الطعام.';
                    break;
            }
            
            doseText.innerText = dose.toFixed(1) + ' سم (ml)';
            freqText.innerText = freq;
            warnText.innerText = warn;
            
            resDiv.classList.remove('opacity-50');
        }

        // Flashcards
        function initFlashcards() {
            currentFlashcards = DRUGS_DATA.filter(d => d.clinical_pearl && d.clinical_pearl.trim().length > 0 && d.id < 251);
            
            // Randomize array
            currentFlashcards = currentFlashcards.sort(() => 0.5 - Math.random());
            
            document.getElementById('fcTotal').innerText = currentFlashcards.length;
            updateMasteredCount();
            
            flashcardIndex = 0;
            showFlashcard();
        }
        
        function updateMasteredCount() {
            const count = currentFlashcards.filter(d => masteredCards.includes(d.id)).length;
            document.getElementById('fcProgress').innerText = count;
        }

        function showFlashcard() {
            if (currentFlashcards.length === 0) return;
            
            if (flashcardIndex >= currentFlashcards.length) flashcardIndex = 0;
            
            const card = currentFlashcards[flashcardIndex];
            const container = document.getElementById('flashcardContainer');
            
            // Smooth reset
            container.style.transition = 'none';
            container.classList.remove('flipped');
            setTimeout(() => container.style.transition = 'transform 0.6s', 50);
            
            document.getElementById('fcFrontName').innerText = card.trade_name || '';
            document.getElementById('fcFrontForm').innerText = card.name_ar || card.dosage_form || '';
            
            document.getElementById('fcBackActive').innerText = card.active_ingredient || '';
            document.getElementById('fcBackIndication').innerText = card.indications || '';
            document.getElementById('fcBackPearl').innerText = card.clinical_pearl || '';
        }
        
        function markFlashcard(isMastered) {
            const card = currentFlashcards[flashcardIndex];
            if (isMastered) {
                if (!masteredCards.includes(card.id)) {
                    masteredCards.push(card.id);
                    localStorage.setItem('pharmaMastered', JSON.stringify(masteredCards));
                    updateMasteredCount();
                }
            } else {
                masteredCards = masteredCards.filter(id => id !== card.id);
                localStorage.setItem('pharmaMastered', JSON.stringify(masteredCards));
                updateMasteredCount();
            }
            
            flashcardIndex++;
            showFlashcard();
        }

        // Interview Simulator Cases
        const INTERVIEW_CASES = [
            {
                title: "فخ صرف المسكن لمريض الضغط",
                question: "دخل عليك زبون الصيدلية يطلب مسكناً قوياً لصداع حاد، وعند سؤاله علمت أنه مريض ضغط دم مزمن. ماذا تتصرف؟",
                trap: "إعطاء بنادول إكسترا، كتافلام، بروفين، أو كونجستال.",
                correctAction: "1. قياس الضغط أولاً للتأكد أنه ليس ارتفاعاً إسعافياً طارئاً (>180/120).\\n2. صرف باراسيتامول صريح فقط (مثل Panadol Advance أو Paramol).\\n3. التنبيه القاطع بالابتعاد عن الكافيين، السودوإيفيدرين، ومسكنات NSAIDs.",
                why: "مسكنات الـ NSAIDs تسبب احتباس الصوديوم والماء وتلغي تأثير أدوية الضغط (ACEi / ARBs)، بينما الكافيين والسودوإيفيدرين يقبضان الأوعية رافعين الضغط بشكل حاد."
            },
            {
                title: "فخ التسلخات الفطرية والكورتيزون",
                question: "شاب يطلب دهان 'بيتاديرم' أو 'ديرموفيت' لتسلخات شديدة وحكة حارقة بين الفخذين، كيف تتعامل مهنياً؟",
                trap: "الموافقة على صرف الكورتيزون الصريح لإرضاء العميل بداعي التسكين السريع.",
                correctAction: "رفض صرف الكورتيزون وتوضيح السبب، وصرف كريم مضاد فطريات واسع المجال (مثل Lamisil أو Canesten) مرتين يومياً لمدة أسبوعين مع تجفيف المكان جيداً.",
                why: "الكورتيزون الصريح يثبط المناعة الموضعية فيغذي فطر الكانديدا ويحول الحالة إلى Tinea Incognito المستعصية بعد تحسن خادع لـ 24 ساعة فقط."
            },
            {
                title: "التفاعل القاتل مع دواء السيولة (Warfarin / Marivan)",
                question: "مريض قلب مركب صمام ويتناول ماريفان، يعاني من صديد شديد بالضرس أو فطريات فم، وطلب فلاجيل أو داكتارين أورال جل. ما قرارك؟",
                trap: "صرف المترونيدازول أو الميكونازول باعتبارهما أدوية كاونتر عادية.",
                correctAction: "حظر صرف Flagyl أو Daktarin Oral Gel نهائياً، وتوجيهه لطبيبه لتعديل جرعة السيولة أو اختيار بدائل آمنة كلياً مثل مضامض الكلورهيكسيدين والنيستاتين الموضعي غير الممتص.",
                why: "الميكونازول والمترونيدازول يثبطان إنزيم الكبد CYP2C9، فيتراكم الوارفارين بالجسم ويقفز تحليل الـ INR لأكثر من 8 مسبباً نزيفاً داخلياً عفوياً مميتاً."
            },
            {
                title: "فخ خافض الحرارة للطفل المصاب بنزلة معوية",
                question: "أم تطلب بروفين أو دولفين لطفل عمره 8 شهور يعاني من حمى وإسهال وقئ مستمر منذ الصباح.",
                trap: "صرف البروفين أو الدولفين لكسر الحرارة العالية.",
                correctAction: "منع البروفين والديكلوفيناك منعاً باتاً؛ يقتصر الخافض على السيتال (الباراسيتامول)، مع إلزام الأم بالبدء الفوري بمحلول الجفاف (ORS) رشفة كل دقيقتين.",
                why: "الإيبوبروفين مع وجود جفاف يمنع تكوين البروستاجلاندين الموسعة لشرايين الكلى، مما يتسبب في فشل كلوي حاد فوري (Prerenal Acute Kidney Injury)."
            },
            {
                title: "البيع المتقاطع الذكي (Smart Cross-Selling) في الروشتات",
                question: "كيف ترفع قيمة الخدمة والفاتورة مهنياً عند صرف روشتة بها: مضاد أوجمنتين 1 جم، ميتفورمين 1000، ومسكن روماتيزم؟",
                trap: "محاولة عرض منتجات تجميل عشوائية أو أدوية لا يحتاجها المريض.",
                correctAction: "1. مع الأوجمنتين: اعرض Probiotic لمنع الإسهال.\\n2. مع الميتفورمين: اعرض فيتامين B12 (مثل Milga Advance) لمنع تنميل واعتلال الأعصاب.\\n3. مع مسكن الروماتيزم: اعرض واقي معدة PPI (مثل Controloc 20/40) قبل الفطار لحماية جدار المعدة.",
                why: "هذا هو البيع الاستشاري القائم على الدليل الإكلينيكي (Evidence-based Value Added) الذي تبحث عنه وتكافئ عليه إدارات سلاسل الصيدليات الكبرى."
            }
        ];

        function renderInterviewCases() {
            const container = document.getElementById('interviewCasesContainer');
            if (!container) return;
            
            container.innerHTML = INTERVIEW_CASES.map((c, index) => `
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900">
                            <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> سيناريو ${index + 1}
                        </span>
                        <h3 class="font-bold text-slate-900 dark:text-white text-base flex-1">${c.title}</h3>
                    </div>
                    
                    <div class="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 mb-4">
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">${c.question}</p>
                    </div>

                    <button onclick="toggleAnswer(${index})" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors mb-3">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                        <span id="btnText-${index}">كشف الإجابة النموذجية والتبرير العلمي</span>
                    </button>

                    <div id="answerBox-${index}" class="hidden space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div class="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-800/40">
                            <span class="font-bold text-rose-700 dark:text-rose-400 block mb-1">❌ الفخ القاتل الذي يرسبك في الإنترفيو:</span>
                            <p class="text-rose-900 dark:text-rose-200">${c.trap}</p>
                        </div>
                        
                        <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
                            <span class="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">✅ التصرف الصيدلاني النموذجي:</span>
                            <p class="text-emerald-900 dark:text-emerald-200 whitespace-pre-line">${c.correctAction}</p>
                        </div>

                        <div class="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg border border-cyan-100 dark:border-cyan-800/40">
                            <span class="font-bold text-cyan-800 dark:text-cyan-300 block mb-1">💡 التفسير العلمي (Clinical Rationale):</span>
                            <p class="text-cyan-900 dark:text-cyan-200">${c.why}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            
            if (window.lucide) lucide.createIcons();
        }

        function toggleAnswer(index) {
            const box = document.getElementById(`answerBox-${index}`);
            const btnText = document.getElementById(`btnText-${index}`);
            if (!box) return;
            
            if (box.classList.contains('hidden')) {
                box.classList.remove('hidden');
                btnText.innerText = 'إخفاء الإجابة';
            } else {
                box.classList.add('hidden');
                btnText.innerText = 'كشف الإجابة النموذجية والتبرير العلمي';
            }
        }

        // Boot
        document.addEventListener('DOMContentLoaded', initApp);
    </script>
</body>
</html>
"""
    with open('e:/a-a-pharmacy/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content.replace("{drugs_json}", drugs_json))
    print("Successfully generated index.html")

if __name__ == '__main__':
    drugs_json = get_combined_drugs()
    generate_html(drugs_json)
