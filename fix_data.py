import json
import glob
import os

dolphin_fixed = {"id":3,"trade_name":"Dolphin Suspension","name_ar":"دولفين شرب أطفال","active_ingredient":"Diclofenac Potassium 9mg/5ml (1.8mg/ml)","dosage_form":"Suspension","sub_form_type":"مسكن ومضاد للالتهاب وخافض حرارة","is_fridge":False,"system_category":"أطفال وحديثي الولادة","indications":"خفض الحرارة المرتفعة المقاومة وتسكين آلام التهابات الأذن واللوز الحادة","dosage_and_admin":"0.5 إلى 1.5 ملغ/كجم مقسمة على مرتين إلى 3 مرات يومياً بعد الأكل (مثال: طفل 10 كجم = 2.5 إلى 4 مل كل 8 ساعات)","clinical_pearl":"لا يصرف للأطفال أقل من عمر سنة، ويحظر إعطاؤه على معدة فارغة أو مع وجود جفاف وإسهال حاد لتجنب الفشل الكلوي","critical_warnings":"ممنوع تماماً في حالات الجفاف الشديد وقرحة المعدة وحساسية الصدر (الربو الحساس للمسكنات)","drug_interactions":"لا يجمع في نفس التوقيت مع البروفين لتفادي النزيف وتدمير وظائف الكلى","special_populations":{"pregnancy":"N/A","hypertension":"Caution","diabetic":"Contains sugar"},"substitutes_same_active":["Babyfen Suspension","Cataflam Drops"],"substitutes_alternative_class":["Brufen Suspension","Cetal Suspension"]}

def fix_json_files():
    files = glob.glob('e:/a-a-pharmacy/study/s/part*.json')
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
            except Exception as e:
                print(f"Error reading {f}: {e}")
                continue
                
        modified = False
        if isinstance(data, list):
            for i, item in enumerate(data):
                if item.get('id') == 3:
                    data[i] = dolphin_fixed
                    modified = True
                if item.get('id') in [6, 7, 8, 36]:
                    data[i]['is_fridge'] = False
                    modified = True
                    
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                json.dump(data, file, ensure_ascii=False, indent=2)
                print(f"Fixed items in {f}")

if __name__ == '__main__':
    fix_json_files()
