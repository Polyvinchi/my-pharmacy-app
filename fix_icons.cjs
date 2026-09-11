const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// Facebook SVG
const fbSvg = '<svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="white" d="M15.4 12l.5-3.3h-3.2V6.5c0-.9.4-1.8 1.9-1.8h1.4V1.8S14.8 1.6 13.5 1.6c-2.6 0-4.3 1.6-4.3 4.5v2.6H6.4V12h2.8v8h3.7v-8h2.5z" /></svg>';
grid = grid.replace(/<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/b\/b8\/2021_Facebook_icon\.svg"[^>]*>/, fbSvg);

// Instagram SVG
const instaSvg = '<svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm"><defs><linearGradient id="instagram" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f09433" /><stop offset="25%" stopColor="#e6683c" /><stop offset="50%" stopColor="#dc2743" /><stop offset="75%" stopColor="#cc2366" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><rect x="0" y="0" width="24" height="24" rx="6" ry="6" fill="url(#instagram)" /><path fill="white" d="M12 7.7a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm0 7.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /><circle fill="white" cx="17.3" cy="6.7" r="1.1" /><path fill="white" d="M17.3 3.5H6.7A3.2 3.2 0 0 0 3.5 6.7v10.6A3.2 3.2 0 0 0 6.7 20.5h10.6a3.2 3.2 0 0 0 3.2-3.2V6.7a3.2 3.2 0 0 0-3.2-3.2zM19 17.3a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 17.3V6.7A1.7 1.7 0 0 1 6.7 5h10.6a1.7 1.7 0 0 1 1.7 1.7v10.6z" /></svg>';
grid = grid.replace(/<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"[^>]*>.*?<\/svg>/, instaSvg);

// WhatsApp SVG
const waSvg = '<svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm"><path fill="#25D366" d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.5 14.1c-.2.7-1.3 1.4-1.9 1.5-.5.1-1.2.2-3.4-.7-2.6-1.1-4.3-3.8-4.4-4-.2-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9 1-2.2.3-.3.6-.4.9-.4h.6c.2 0 .5-.1.7.5.3.7.9 2.3 1 2.5.1.2.1.4 0 .6s-.2.3-.4.5c-.2.2-.4.4-.5.6-.2.2-.4.4-.1.8.3.5 1.4 2.3 2.8 3.5 1.8 1.5 3.4 2 3.9 2.3.4.2.7.2.9-.1.3-.3 1.1-1.3 1.4-1.7.3-.4.6-.3.9-.2.4.1 2.3 1.1 2.7 1.3.4.2.6.3.7.5.1.4.1 1.1-.1 1.8z" /></svg>';
grid = grid.replace(/<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/6\/6b\/WhatsApp\.svg"[^>]*>/, waSvg);

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Icons updated to Native SVG');
