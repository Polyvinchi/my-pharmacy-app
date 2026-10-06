const fs = require('fs');

let om = fs.readFileSync('src/app/admin/OffersManager.tsx', 'utf-8');

// 1. Add ImageUploader import if missing
if (!om.includes("import ImageUploader")) {
  om = om.replace("import { Plus, X, Package2, Image as ImageIcon } from 'lucide-react'", 
    "import { Plus, X, Package2, Image as ImageIcon } from 'lucide-react'\nimport ImageUploader from '@/components/ImageUploader'");
}

// 2. Replace the HTML native file input with ImageUploader
const fileInputSectionRegex = /<div>\s*<p className="text-xs text-slate-500 mb-1">1\. ارفع صور من جهازك.*?<\/p>\s*<input name="images" type="file".*?\/>\s*<\/div>/s;

const newImageUploaderSection = `<div>
                            <p className="text-xs text-slate-500 mb-2">1. ارفع وقص صورة للعرض (يمكنك رفع عدة صور بالضغط مرات متتالية):</p>
                            <ImageUploader 
                              onUpload={(url) => { if(url) setImageUrls(prev => [...prev, url]) }} 
                              label="ارفع واقص صورة جديدة" 
                              folder="offers" 
                              aspect={1}
                              shape="rect"
                            />
                            {/* Hidden input to bypass the native file upload action if needed */}
                            <input name="externalImages" type="hidden" value={JSON.stringify(imageUrls)} />
                          </div>`;

if (fileInputSectionRegex.test(om)) {
  om = om.replace(fileInputSectionRegex, newImageUploaderSection);
  fs.writeFileSync('src/app/admin/OffersManager.tsx', om, 'utf-8');
  console.log('Updated OffersManager.tsx successfully');
} else {
  console.log('Regex did not match in OffersManager.tsx');
}
