const fs = require('fs');

let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

// 1. Remove states
tm = tm.replace(/  const \[whatsapp, setWhatsapp\] = useState\(initialData\.social_links\?\.whatsapp \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[phone, setPhone\] = useState\(initialData\.social_links\?\.phone \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[landline, setLandline\] = useState\(initialData\.social_links\?\.landline \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[instapay, setInstapay\] = useState\(initialData\.social_links\?\.instapay \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[wallet, setWallet\] = useState\(initialData\.social_links\?\.wallet \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[facebook, setFacebook\] = useState\(initialData\.social_links\?\.facebook \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[instagram, setInstagram\] = useState\(initialData\.social_links\?\.instagram \|\| ''\)\n/g, '');
tm = tm.replace(/  const \[talabat, setTalabat\] = useState\(initialData\.social_links\?\.talabat \|\| ''\)\n/g, '');

// 2. Remove socialLinks from payload building
tm = tm.replace(/      const socialLinks = \{\n        \.\.\.initialData\.social_links,\n        whatsapp,\n        phone,\n        landline,\n        instapay,\n        wallet,\n        facebook,\n        instagram,\n        talabat\n      \}/, '      const socialLinks = initialData.social_links || {};');

// 3. Remove UI sections (Contact, Socials, Payments)
const uiRegex = /\{\/\* أرقام التواصل \*\/\}.*?(?=\{\/\* حالة الصيدلية ومواعيد العمل \*\/\})/s;
tm = tm.replace(uiRegex, '');

fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
console.log('Cleaned up ThemeManager');
