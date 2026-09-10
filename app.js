
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

let currentFlashcards = [];
let flashcardIndex = 0;

let currentCardIndex = 0;
let masteredCards = new Set();
        
// PharmaPocket EG - Core Engine
let ALL_DRUGS = [];
let CURRENT_FILTER_CATEGORY = 'الكل';
let INTERVIEW_CASES = [
    {
        title: "وصف المسكنات لمرضى الضغط",
        question: "طلب منك المريض مسكناً قوياً للصداع (مثل كتافلام أو باي ألكوفان)، ولكنك علمت أنه مريض بضغط الدم المرتفع المستمر.",
        trap: "صرف الـ NSAIDs (مثل الديكلوفين أو الكيتوبروفين) بناءً على طلب المريض مباشرة لسرعة مفعولها.",
        correctAction: "رفض الـ NSAIDs تماماً لأنها تحبس السوائل والأملاح فترفع الضغط وقد تسبب أزمة طارئة. البديل الآمن الوحيد هو الباراسيتامول الصريح (Panadol Advance).",
        why: "عائلة الـ NSAIDs تعاكس عمل أدوية الضغط وتقلل تدفق الدم للكلى، مما يؤدي لارتفاع حاد في ضغط الدم."
    },
    {
        title: "فخ التداخل بين الإيموران والزيلوريك",
        question: "مريض زرع كلى يصرف رشتته الشهرية (Imuran 50mg)، والطبيب كتب له (Zyloric 300mg) لعلاج النقرس.",
        trap: "صرف الروشتة كما هي دون تنبيه المريض أو مراجعة الطبيب، بحجة أن الدواءين في تخصصين مختلفين.",
        correctAction: "تدخل فوري! الزيلوريك يمنع تكسير الإيموران في الكبد مما يضاعف تركيزه لدرجات سمية تدميرية. يجب التواصل مع الطبيب لتخفيض جرعة الإيموران بنسبة 75%.",
        why: "الزيلوريك يثبط إنزيم Xanthine Oxidase المسؤول عن استقلاب الإيموران، فتتراكم المادة الفعالة مسببة فشلاً حاداً ومميتاً في نخاع العظم."
    },
    {
        title: "مغص الرضع وأدوية التقلصات في الشهور الأولى",
        question: "أم تطلب دواءً للمغص القوي لطفلها الرضيع ذو الـ 3 أسابيع، وزميلك يهم بصرف (Spasmotal Drops).",
        trap: "إعطاء أي دواء مغص يحتوي على مادة ديسيكلومين (Dicyclomine) لرضيع أقل من 6 شهور.",
        correctAction: "إيقاف الزميل وتغيير الدواء فوراً إلى سايميثيكون (مثل Dentinox). أدوية الديسيكلومين ممنوعة عالمياً أقل من 6 شهور لأنها تسبب توقف التنفس والموت المفاجئ.",
        why: "الديسيكلومين يعبر حاجز المخ للرضع لعدم اكتماله، مسبباً تثبيطاً للجهاز التنفسي المركزي."
    },
    {
        title: "التبول اللاإرادي (Minirin Melt) وشرب الماء",
        question: "طفل يُصرف له علاج التبول اللاإرادي (مينيرين ميلت 120 ميكروجرام)، والأم تسأل: متى أعطيه الدواء؟",
        trap: "أن تقول لها: قبل النوم، وتنسى التحذير الأهم على الإطلاق.",
        correctAction: "يجب منع الطفل من شرب الماء قبل الجرعة بساعة ولمدة 8 ساعات بعدها. شرب الماء مع الدواء يحبس السوائل ويهبط بالصوديوم مسبباً تشنجات وغيبوبة.",
        why: "المينيرين هو هرمون مانع لإدرار البول يعيد امتصاص الماء للكلى بقوة."
    },
    {
        title: "صرف أدوية التخسيس (Orlistat) مع الفيتامينات",
        question: "مريضة تطلب أورليستات للتخسيس مع كبسولات فيتامين د (Vitamin D3) لأنها تعاني من نقص حاد.",
        trap: "أن تتركهما يأخذان معاً في نفس التوقيت.",
        correctAction: "التنبيه المشدد على فصل الفيتامين عن الأورليستات بساعتين على الأقل.",
        why: "الأورليستات يمنع امتصاص الدهون من الوجبة، وفيتامين د يذوب في الدهون، وبالتالي سيخرج الفيتامين مع الفضلات ولن يمتص إطلاقاً."
    },
    {
        title: "الفلاجيل (Metronidazole) مع الكحوليات",
        question: "مريض أجنبي يشتري فلاجيل 500 للأسنان، وهو معروف بتناوله للكحوليات.",
        trap: "عدم تحذيره من الجمع بينهما.",
        correctAction: "تحذير المريض بصرامة من تناول أي كحوليات أثناء كورس الفلاجيل ولمدة 48 ساعة بعده.",
        why: "يسبب تفاعل (Disulfiram-like reaction) العنيف، والذي يؤدي إلى قيء شديد، خفقان، انخفاض الضغط، وصداع مميت."
    },
    {
        title: "بخاخات الكورتيزون (Flixotide) وفطريات الفم",
        question: "مريض يصرف بخاخ فليكسوتيد للربو لأول مرة.",
        trap: "شرح طريقة الرش فقط دون ذكر خطوة ما بعد الرش.",
        correctAction: "يجب أمره بالمضمضة بالماء وبصقه فوراً بعد كل جرعة.",
        why: "بقايا الكورتيزون في الفم تسبب نمو فطريات بيضاء (Oral Thrush) مزعجة جداً وبحة في الصوت."
    },
    {
        title: "حب الشباب (Roaccutane) والحمل",
        question: "فتاة مقبلة على الزواج تصرف كورس الروآكيوتان لعلاج حب الشباب.",
        trap: "عدم سؤالها عن موعد زواجها أو خطط الحمل.",
        correctAction: "منع الدواء إذا كان الزواج خلال شهر أو شهرين. يجب استخدام مانع حمل قوي طوال الكورس وشهر بعد التوقف.",
        why: "الآيزوتريتينوين مشوه جنيني قاطع (Teratogenic) يسبب تشوهات قلبية ودماغية خطيرة للجنين."
    },
    {
        title: "قطرات احتقان الأنف (Otrivin) والتعود",
        question: "مريض يطلب أوتريفين ويخبرك أنه يستخدمها يومياً منذ شهر ليرتاح في النوم.",
        trap: "صرف القطرة وتمني الشفاء العاجل.",
        correctAction: "رفض الصرف المستمر وشرح ظاهرة (Rhinitis Medicamentosa). القطرة لا تزيد عن 5 أيام.",
        why: "الاستخدام المطول يسبب تدميراً لمستقبلات الأوعية الدموية في الأنف، مما يؤدي لاحتقان ارتدادي مزمن لا يزول إلا بجراحة."
    },
    {
        title: "الفياجرا وأدوية الذبحة (Nitrates)",
        question: "مريض مسن يطلب سيلدينافيل (فياجرا) وهو يتناول داينيترا (Isosorbide Dinitrate) لذبحة صدرية.",
        trap: "صرف الدواء بناءً على طلبه.",
        correctAction: "المنع القاطع! لا يجتمعان أبداً، وقد يؤدي ذلك لوفاة فورية.",
        why: "الدواءان يوسعان الأوعية الدموية معاً، مما يسبب هبوطاً حاداً ومميتاً في ضغط الدم لا يمكن تداركه."
    }
];

function initializeDatabase() {
    ALL_DRUGS = [
        ...(window.PART1_DATA || []),
        ...(window.PART2_DATA || []),
        ...(window.PART3_DATA || []),
        ...(window.PART4_DATA || []),
        ...(window.PART5_DATA || []),
        ...(window.PART6_DATA || []),
        ...(window.PART7_DATA || []),
        ...(window.PART8_DATA || []),
        ...(window.PART9_DATA || []),
        ...(window.PART10_DATA || []),
        ...(window.PART11_DATA || []),
        ...(window.PART12_DATA || []),
        ...(window.PART13_DATA || [])
    ];

    // الترتيب الأبجدي الفوري (A to Z)
    ALL_DRUGS.sort((a, b) => (a.trade_name || '').localeCompare(b.trade_name || ''));

    // تنظيف تلقائي للبدائل المكررة والـ generic
    ALL_DRUGS.forEach(drug => {
        if (Array.isArray(drug.substitutes_same_active)) {
            drug.substitutes_same_active = drug.substitutes_same_active.filter(
                sub => sub && !sub.toLowerCase().includes('generic') && sub !== '-'
            );
        }
    });

    const counter = document.getElementById('totalDrugsCount');
    if (counter) counter.innerText = ALL_DRUGS.length;

    renderCards(ALL_DRUGS, '');
    renderInterviewCases();

    renderOTC();
    renderIngredients();
    initFlashcards();
    
    renderShelfCategories();
    
    // إعداد التوجيه الخلفي وتاريخ المتصفح (History / PopState)
    window.addEventListener('popstate', handlePopState);
    handlePopState();

    if (window.lucide) lucide.createIcons();
}


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

    renderCards(filtered, q);
}
function clearSearch() {
    const input = document.getElementById('liveSearchInput');
    if (input) {
        input.value = '';
        input.focus();
    }
    handleSearch('');
}

function setCategoryFilter(category, btnElement) {
    CURRENT_FILTER_CATEGORY = category;
    document.querySelectorAll('.chip-btn').forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'font-bold');
        b.classList.add('bg-slate-800', 'text-slate-300');
    });
    btnElement.classList.add('bg-emerald-600', 'text-white', 'font-bold');
    btnElement.classList.remove('bg-slate-800', 'text-slate-300');
    
    const input = document.getElementById('liveSearchInput');
    handleSearch(input ? input.value : '');
}

function getFormIcon(form) {
    const f = form.toLowerCase();
    if (f.includes('syrup') || f.includes('susp')) return 'bottle';
    if (f.includes('drop')) return 'droplets';
    if (f.includes('cream') || f.includes('gel') || f.includes('oint')) return 'hand-metal';
    if (f.includes('supp')) return 'rocket';
    if (f.includes('ampoule') || f.includes('vial') || f.includes('inject')) return 'syringe';
    if (f.includes('inhaler') || f.includes('spray')) return 'wind';
    if (f.includes('sachet') || f.includes('powder')) return 'box';
    if (f.includes('kit') || f.includes('device')) return 'stethoscope';
    return 'pill';
}


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

function openDrugModal(drugId, pushState = true) {
    const drug = ALL_DRUGS.find(d => d.id === drugId);
    if (!drug) return;

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('modalContent');
    
    if (!modal || !content) return;

    // Substitute logic
    let subsHtml = '';
    const hasSameActive = Array.isArray(drug.substitutes_same_active) && drug.substitutes_same_active.length > 0 && drug.substitutes_same_active[0] !== '-';
    const hasAltClass = Array.isArray(drug.substitutes_alternative_class) && drug.substitutes_alternative_class.length > 0 && drug.substitutes_alternative_class[0] !== '-';

    if (hasSameActive || hasAltClass) {
        subsHtml = `
            <div class="mt-5 space-y-3 pt-4 border-t border-slate-800">
                <h4 class="font-bold text-slate-300 flex items-center gap-2"><i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-400"></i> البدائل والمثائل المتاحة</h4>
                <div class="grid grid-cols-2 gap-3 text-xs">
                    ${hasSameActive ? `
                        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <span class="block text-slate-400 mb-1 font-semibold">نفس المادة الفعالة:</span>
                            <ul class="list-disc list-inside text-emerald-300 space-y-1 ml-1">
                                ${drug.substitutes_same_active.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${hasAltClass ? `
                        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <span class="block text-slate-400 mb-1 font-semibold">عائلات بديلة (تأثير مماثل):</span>
                            <ul class="list-disc list-inside text-blue-300 space-y-1 ml-1">
                                ${drug.substitutes_alternative_class.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-start border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                        <i data-lucide="${getFormIcon(drug.dosage_form || '')}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">${drug.trade_name}</h2>
                        <p class="text-sm text-emerald-400 font-semibold">${drug.name_ar || ''}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-3 text-sm">
                <div class="bg-slate-800/30 p-3 rounded-lg border border-slate-800/50">
                    <strong class="text-slate-400 block text-xs mb-1">المادة الفعالة والتركيز:</strong>
                    <span class="text-emerald-300 font-medium">${drug.active_ingredient || '-'}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-slate-800/30 p-3 rounded-lg border border-slate-800/50">
                        <strong class="text-slate-400 block text-xs mb-1">دواعي الاستعمال:</strong>
                        <span class="text-slate-200">${drug.indications || '-'}</span>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg border border-slate-800/50">
                        <strong class="text-slate-400 block text-xs mb-1">الجرعة المعتادة:</strong>
                        <span class="text-slate-200">${drug.dosage_and_admin || '-'}</span>
                    </div>
                </div>

                ${drug.clinical_pearl ? `
                    <div class="bg-amber-950/40 border border-amber-900/60 p-4 rounded-xl text-amber-200 shadow-sm mt-2">
                        <div class="flex items-center gap-2 font-bold mb-1">
                            <i data-lucide="lightbulb" class="w-4 h-4"></i> تريكة الصيدلي (Clinical Pearl)
                        </div>
                        <p class="leading-relaxed text-sm">${drug.clinical_pearl}</p>
                    </div>
                ` : ''}

                ${drug.critical_warnings ? `
                    <div class="bg-rose-950/40 border border-rose-900/60 p-4 rounded-xl text-rose-200 shadow-sm mt-2">
                        <div class="flex items-center gap-2 font-bold mb-1">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i> تحذيرات حرجة وموانع
                        </div>
                        <p class="leading-relaxed text-sm">${drug.critical_warnings}</p>
                    </div>
                ` : ''}
            </div>
            
            ${subsHtml}
        </div>
    `;

    if (window.lucide) lucide.createIcons();

    // Show modal with animation
    modal.classList.remove('hidden');
    // small timeout to allow display:block to apply before animating opacity
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        document.getElementById('detailModalContent').classList.remove('scale-95');
    }, 10);

    if (pushState) {
        history.pushState({ modal: true, id: drugId }, '', '#drug-' + drugId);
    }
}

function closeModal(pushState = true) {
    const modal = document.getElementById('detailModal');
    if (!modal) return;
    
    // Hide with animation
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('detailModalContent').classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);

    if (pushState) {
        history.back(); // Use history back to natively pop the state!
    }
}

// 6. Navigation Tabs
function switchTab(tabId, pushState = true) {
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

    // When switching to flashcards, refresh counter
    if (tabId === 'tab-flashcards') {
        setTimeout(() => { if (typeof refreshFlashcardUI === 'function') refreshFlashcardUI(); }, 50);
    }
    
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


function toggleMobileSidebar() {
    // Sidebar no longer used on mobile - handled by bottom nav
}

// History API popstate handler
function handlePopState(e) {
    const hash = window.location.hash;
    const modal = document.getElementById('detailModal');
    const isModalOpen = modal && !modal.classList.contains('hidden');

    if (hash.startsWith('#drug-')) {
        const id = parseInt(hash.replace('#drug-', ''));
        openDrugModal(id, false);
    } else {
        if (isModalOpen) {
            closeModal(false);
        }
        
        if (hash.startsWith('#tab-')) {
            switchTab(hash.replace('#', ''), false);
        } else if (!hash) {
            switchTab('tab-directory', false);
        }
    }
}

// Shelf View Render
function renderShelfCategories() {
    const categories = ['أطفال', 'مسكنات وعظام', 'جهاز هضمي ومعدة', 'جهاز تنفسي وبرد', 'ضغط وقلب', 'سكر ودهون', 'حقن وطوارئ', 'جلدية وحروق', 'حساسية وجلدية', 'نساء وتوليد', 'مسالك ومطهرات', 'أعصاب ونفسية'];
    const container = document.getElementById('shelfCategoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div onclick="openShelfCategory('${cat}')" class="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <i data-lucide="layers" class="w-6 h-6 text-slate-400 group-hover:text-blue-400"></i>
                </div>
                <div>
                    <h3 class="font-bold text-white text-lg">${cat}</h3>
                    <p class="text-xs text-slate-500 mt-1">عرض الأدوية على الرف</p>
                </div>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

function openShelfCategory(category) {
    const drugs = ALL_DRUGS.filter(d => d.system_category && d.system_category.includes(category));
    const catGrid = document.getElementById('shelfCategoriesGrid');
    const itemsGrid = document.getElementById('shelfItemsGrid');
    
    catGrid.classList.add('hidden');
    itemsGrid.classList.remove('hidden');
    
    itemsGrid.innerHTML = `
        <div class="col-span-full mb-4 flex items-center gap-3">
            <button onclick="backToShelfCategories()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                <i data-lucide="arrow-right" class="w-4 h-4"></i> رجوع للرفوف
            </button>
            <h3 class="font-bold text-white text-lg">رف: ${category}</h3>
        </div>
    ` + drugs.map(d => `
        <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all shadow-sm">
            <div class="font-bold text-white">${d.trade_name}</div>
            <div class="text-xs text-slate-400">${d.dosage_form}</div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

function backToShelfCategories() {
    document.getElementById('shelfCategoriesGrid').classList.remove('hidden');
    document.getElementById('shelfItemsGrid').classList.add('hidden');
}

// Pediatric Calculator
function calculateDose() {
    const weightInput = document.getElementById('calcWeight').value;
    const weight = parseFloat(weightInput);
    const drug = document.getElementById('calcDrug').value;
    const resDiv = document.getElementById('calcResult');
    const doseText = document.getElementById('calcDoseText');
    const freqText = document.getElementById('calcFreqText');
    const warnText = document.getElementById('calcWarningText');
    
    if (!weight || weight <= 0 || !drug) {
        doseText.innerText = '-';
        freqText.innerText = '-';
        warnText.innerText = 'يرجى إدخال وزن الطفل واختيار الدواء بشكل صحيح';
        resDiv.classList.add('opacity-50');
        return;
    }
    
    let mlDose = 0;
    let freq = '';
    let warning = '';
    
    switch (drug) {
        case 'paracetamol_120': 
            mlDose = ((weight * 15) / 24).toFixed(1);
            freq = 'كل 4 إلى 6 ساعات عند اللزوم (أقصى 4 مرات يومياً)';
            warning = 'آمن من عمر شهر، الجرعة القصوى اليومية 60 ملغ/كجم.';
            break;
        case 'paracetamol_250':
            mlDose = ((weight * 15) / 50).toFixed(1);
            freq = 'كل 6 ساعات عند اللزوم';
            warning = 'تركيز مضاعف (Forte)؛ انتبه لتفادي الجرعة الزائدة، يفضل للأوزان فوق 15 كجم.';
            break;
        case 'ibuprofen_100':
            mlDose = ((weight * 10) / 20).toFixed(1);
            freq = 'كل 8 ساعات بعد الأكل أو الرضاعة مباشرة';
            warning = 'ممنوع قطعاً للأطفال أقل من 6 أشهر، وممنوع في حالات الجفاف النشط والنزلة المعوية.';
            break;
        case 'augmentin_228':
            mlDose = ((weight * 20) / 45.6).toFixed(1);
            freq = 'مرتان يومياً (كل 12 ساعة) مع بداية الوجبة';
            warning = 'يحفظ في الثلاجة بعد الحل وصالح لـ 7 أيام فقط، يؤخذ مع الطعام لتقليل الإسهال.';
            break;
        case 'augmentin_457': 
            mlDose = ((weight * 20) / 91.4).toFixed(1);
            freq = 'مرتان يومياً (كل 12 ساعة) بانتظام';
            warning = 'تركيز عالي؛ يحسب بدقة، ويجب إكمال الكورس العلاجي كاملاً.';
            break;
        case 'azithro_200': 
            mlDose = ((weight * 10) / 40).toFixed(1);
            freq = 'مرة واحدة يومياً لمدة 3 إلى 5 أيام فقط';
            warning = 'يؤخذ على معدة فارغة قبل الأكل بساعة أو بعده بساعتين، ويرج جيداً.';
            break;
        case 'cefixime_100':
            mlDose = ((weight * 8) / 20).toFixed(1);
            freq = 'مرة واحدة يومياً (أو تقسم كل 12 ساعة)';
            warning = 'لا يشترط الأكل، ممتاز لالتهابات الأذن والمسالك المقاومة.';
            break;
    }
    
    doseText.innerText = `${mlDose} مل (سم)`;
    freqText.innerText = freq;
    warnText.innerText = warning;
    resDiv.classList.remove('opacity-50');
}

// Interview Cases
function renderInterviewCases() {
    const container = document.getElementById('interviewCasesContainer');
    if (!container) return;
    
    container.innerHTML = INTERVIEW_CASES.map((c, index) => `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-rose-500/50 transition-all">
            <div class="flex items-start justify-between gap-3 mb-3">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/50 px-2.5 py-1 rounded-md border border-rose-900">
                    <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> سيناريو ${index + 1}
                </span>
                <h3 class="font-bold text-white text-base flex-1">${c.title}</h3>
            </div>
            
            <div class="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 mb-4">
                <p class="text-sm font-semibold text-slate-200 leading-relaxed">${c.question}</p>
            </div>

            <button onclick="toggleAnswer(${index})" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors mb-3">
                <i data-lucide="eye" class="w-4 h-4"></i>
                <span id="btnText-${index}">إظهار الإجابة النموذجية والتعليل</span>
            </button>

            <div id="answerBox-${index}" class="hidden space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div class="bg-rose-900/20 p-3 rounded-lg border border-rose-800/40">
                    <span class="font-bold text-rose-400 block mb-1">🚨 الفخ السريري:</span>
                    <p class="text-rose-200">${c.trap}</p>
                </div>
                
                <div class="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/40">
                    <span class="font-bold text-emerald-400 block mb-1">✅ التصرف النموذجي:</span>
                    <p class="text-emerald-200 whitespace-pre-line">${c.correctAction}</p>
                </div>

                <div class="bg-cyan-900/20 p-3 rounded-lg border border-cyan-800/40">
                    <span class="font-bold text-cyan-300 block mb-1">💡 التفسير (Rationale):</span>
                    <p class="text-cyan-200">${c.why}</p>
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
        btnText.innerText = 'إظهار الإجابة النموذجية والتعليل';
    }
}

window.addEventListener('DOMContentLoaded', initializeDatabase);





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
function renderIngredients(query = '') {
            const container = document.getElementById('ingredientList');
            const q = query.trim().toLowerCase();
            
            const grouped = {};
            ALL_DRUGS.forEach(d => {
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


function initFlashcards() {
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
        const pearlText = (card.clinical_pearl || '') + (card.critical_warnings ? '\n\n⚠ ' + card.critical_warnings : '');
        backPearl.innerText = pearlText || '-';
    }
}

function markFlashcard(isMastered) {
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
}

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
function renderIngredients(query = '') {
            const container = document.getElementById('ingredientList');
            const q = query.trim().toLowerCase();
            
            const grouped = {};
            ALL_DRUGS.forEach(d => {
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

function initFlashcards() {
    // بناء الكروت من الأدوية التي تحتوي على تحذيرات حرجة أو تريكات سريرية
    flashcards = ALL_DRUGS.filter(d => d.clinical_pearl || d.critical_warnings);
    
    // خلط الكروت
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    
    currentCardIndex = 0;
    masteredCards.clear();
    updateMasteredCount();
    document.getElementById('fcTotal').innerText = currentFlashcards.length;
    showFlashcard();
}


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
function markFlashcard(isMastered) {
    if (flashcards.length === 0) return;
    
    if (isMastered) {
        masteredCards.add(flashcards[currentCardIndex].id);
        updateMasteredCount();
    document.getElementById('fcTotal').innerText = currentFlashcards.length;
    }
    
    currentCardIndex++;
    showFlashcard();
}

function updateMasteredCount() {
    const el = document.getElementById('masteredCount');
    if (el) el.innerText = masteredCards.size;
}


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