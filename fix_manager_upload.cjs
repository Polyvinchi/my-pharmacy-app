const fs = require('fs');
let code = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf8');

// Add import
code = code.replace(
  "import { Check, X, Save, Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Image as ImageIcon } from 'lucide-react'",
  "import { Check, X, Save, Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Image as ImageIcon } from 'lucide-react'\nimport ImageUploader from '@/components/ImageUploader'"
);

// Replace the image url text input with ImageUploader
code = code.replace(
  '<input type="text" placeholder="https://..." value={itemImageUrl} onChange={e => setItemImageUrl(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-purple-500" dir="ltr" />',
  '<ImageUploader onUpload={(url) => setItemImageUrl(url)} currentImage={itemImageUrl} label="???? ???? (????? ????????)" folder="section_icons" />'
);

fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', code, 'utf8');
