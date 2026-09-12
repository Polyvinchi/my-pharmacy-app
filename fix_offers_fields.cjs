const fs = require('fs');
let code = fs.readFileSync('src/components/OffersDrawer.tsx', 'utf8');

// Replace old offer fields with new Supabase DB fields
code = code.replace(/offer\.img_url \|\| offer\.img/g, 'offer.images?.[0] || offer.img_url');
code = code.replace(/selectedOffer\.img_url \|\| selectedOffer\.img/g, 'selectedOffer.images?.[0] || selectedOffer.img_url');

code = code.replace(/offer\.old_price \|\| offer\.oldPrice/g, 'offer.original_price || offer.old_price');
code = code.replace(/selectedOffer\.old_price \|\| selectedOffer\.oldPrice/g, 'selectedOffer.original_price || selectedOffer.old_price');

code = code.replace(/offer\.price/g, 'offer.discounted_price || offer.price');
code = code.replace(/selectedOffer\.price/g, 'selectedOffer.discounted_price || selectedOffer.price');

// Update WhatsApp Link to use the buildWhatsAppOfferLink ideally, but for now just update the hardcoded link
code = code.replace(
  /\https:\/\/wa.me\/20100000000\?text=\\?\$\\{encodeURIComponent\('[^']+' \+ selectedOffer\.title\)\\?\}\\?\/g,
  '\https://wa.me/20100000000?text=\\$\\{encodeURIComponent("??????? ????? ???? ?????: " + selectedOffer.title + "\\n\\n?????: " + (selectedOffer.discounted_price || selectedOffer.price) + " ?.?")\\}\'
);

fs.writeFileSync('src/components/OffersDrawer.tsx', code, 'utf8');
