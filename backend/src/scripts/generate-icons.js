const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../../../frontend/public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const icons = {
  'restaurants.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#216FC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v19"/><path d="M5 2v7a4 4 0 0 0 4 4v8"/><path d="M5 2h4"/></svg>`,
  'hospitals.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#168865" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  'hotels.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F7772B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>`,
  'beauty-salons.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#216FC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  'home-services.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#132F50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  'education.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#216FC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  'real-estate.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F7772B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'automotive.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#132F50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>`,
  'construction.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F7772B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M11 2v20"/><path d="m15 2 4 4-4 4"/><path d="M20 6H11"/></svg>`,
  'travel.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#216FC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  'verified-badge.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#168865"><path d="M12 2l3.09 3.26L19.5 5.8l.94 4.39 3.56 2.73-1.6 4.2 1.6 4.2-3.56 2.73-.94 4.39-4.41.54L12 22l-3.09-3.26L4.5 18.2l-.94-4.39L0 11.08l1.6-4.2L0 2.68l3.56-2.73L4.5.56l4.41-.54L12 2zm-1.5 13.5l6-6-1.41-1.41-4.59 4.58-2.09-2.08L7 12l3.5 3.5z"/></svg>`,
  'logo-localfind.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" fill="none"><rect width="40" height="40" y="4" rx="10" fill="#132F50"/><circle cx="20" cy="24" r="10" stroke="#F7772B" stroke-width="3"/><circle cx="20" cy="24" r="4" fill="#216FC6"/><path d="M20 14v4M20 30v4M10 24h4M26 24h4" stroke="#168865" stroke-width="2"/><text x="48" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#132F50">Local<tspan fill="#216FC6">Find</tspan></text><text x="49" y="38" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" fill="#F7772B" letter-spacing="2">INDIA DIRECTORY</text></svg>`,
};

for (const [name, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconsDir, name), content.trim());
}
console.log(`Generated ${Object.keys(icons).length} SVG icons in frontend/public/icons/`);
