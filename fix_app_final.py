import codecs
import re

def fix_app():
    # 1. Update index.html
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        html = f.read()

    # Add custom scrollbar CSS
    if '::-webkit-scrollbar' not in html:
        scrollbar_css = """
    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #0f172a; 
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #334155; 
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #10b981; 
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
    </style>
"""
        html = html.replace('</head>', scrollbar_css + '\n</head>')

    # Add Devices Nav Button
    if 'btn-tab-devices' not in html:
        devices_btn = """
                <button onclick="switchTab('tab-devices')" id="btn-tab-devices" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all">
                    <i data-lucide="stethoscope" class="w-4 h-4 shrink-0"></i> أجهزة ومستلزمات
                </button>
        """
        html = html.replace('<!-- TAB_INJECT_MARKER -->', '')
        # Insert after OTC tab
        nav_target = '<button onclick="switchTab(\'tab-rx\')"'
        html = html.replace(nav_target, devices_btn + '\n' + nav_target)

    # Add Devices Section
    if 'id="tab-devices"' not in html:
        devices_section = """
            <!-- Tab Devices -->
            <section id="tab-devices" class="tab-pane hidden max-w-6xl mx-auto w-full">
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold text-white">الأجهزة والمستلزمات الطبية 🩺</h2>
                        <p class="text-sm text-slate-400 mt-1">أجهزة القياس والشرائط والمستلزمات اليومية</p>
                    </div>
                </div>
                <div id="devicesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <!-- Cards -->
                </div>
            </section>
        """
        html = html.replace('id="tab-rx"', devices_section + '\n\n<section id="tab-rx"')

    # Fix OTC title
    html = html.replace('OTC والأجهزة والمستلزمات', 'بروتوكولات الـ OTC والعلاجات الشائعة')

    with codecs.open('e:/a-a-pharmacy/index.html', 'w', 'utf-8') as f:
        f.write(html)


    # 2. Update app.js
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()

    # Expand Interview Cases
    if 'INTERVIEW_CASES = [' in app_js:
        expanded_cases = """let INTERVIEW_CASES = [
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
];"""
        app_js = re.sub(r'let INTERVIEW_CASES = \[.*?\];', expanded_cases, app_js, flags=re.DOTALL)

    # Rewrite initFlashcards to build dynamically
    flashcard_func = """
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
    `;
    
    if(window.lucide) lucide.createIcons();
}

function markFlashcard(isMastered) {
    if (flashcards.length === 0) return;
    
    if (isMastered) {
        masteredCards.add(flashcards[currentCardIndex].id);
        updateMasteredCount();
    }
    
    currentCardIndex++;
    showFlashcard();
}

function updateMasteredCount() {
    const el = document.getElementById('masteredCount');
    if (el) el.innerText = masteredCards.size;
}
"""
    # Replace old flashcard functions
    app_js = re.sub(r'function initFlashcards.*?function updateMasteredCount.*?\}', flashcard_func, app_js, flags=re.DOTALL)


    # Rewrite renderOTC to separate devices
    otc_func = """
function renderOTC() {
    const grid = document.getElementById('otcGrid');
    if (!grid) return;
    
    // فلترة للـ OTC فقط (استبعاد الأجهزة)
    const otcItems = ALL_DRUGS.filter(d => 
        (d.id >= 251 && d.id <= 300) || 
        (d.system_category && d.system_category.includes('OTC')) ||
        (d.sub_form_type && d.sub_form_type.includes('OTC'))
    ).filter(d => !d.system_category || !d.system_category.includes('أجهزة ومستلزمات'));

    grid.innerHTML = otcItems.map(d => `
        <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer">
            <h3 class="text-lg font-bold text-emerald-400 mb-2">${d.trade_name}</h3>
            <p class="text-sm text-slate-300 mb-3">${d.indications || ''}</p>
            <div class="bg-slate-800/50 p-2 rounded text-xs text-slate-400 font-mono">
                ${d.dosage_and_admin || ''}
            </div>
        </div>
    `).join('');
    
    renderDevices();
}

function renderDevices() {
    const grid = document.getElementById('devicesGrid');
    if (!grid) return;
    
    const deviceItems = ALL_DRUGS.filter(d => d.system_category && d.system_category.includes('أجهزة ومستلزمات'));
    
    grid.innerHTML = deviceItems.map(d => `
        <div onclick="openDrugModal(${d.id})" class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all cursor-pointer">
            <h3 class="text-lg font-bold text-blue-400 mb-2">${d.trade_name}</h3>
            <p class="text-sm text-slate-300 mb-3">${d.indications || ''}</p>
            <div class="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50">
                <span class="text-xs text-blue-300">${d.clinical_pearl || ''}</span>
            </div>
        </div>
    `).join('');
}
"""
    app_js = re.sub(r'function renderOTC\(\) \{.*?\}\s*(?=function renderIngredients)', otc_func, app_js, flags=re.DOTALL)

    # Initialize devices in initializeDatabase
    if 'renderOTC();' in app_js and 'renderDevices();' not in app_js:
        app_js = app_js.replace('renderOTC();', 'renderOTC();\n    if(typeof renderDevices === \'function\') renderDevices();')

    with codecs.open('e:/a-a-pharmacy/app.js', 'w', 'utf-8') as f:
        f.write(app_js)

    print("Fixes applied.")

fix_app()
