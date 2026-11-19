const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '../../../docs/reference_pptx/ppt/slides');
const files = fs.readdirSync(slidesDir).filter(f => f.startsWith('slide') && f.endsWith('.xml'));
files.sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')));

for (const file of files) {
  const content = fs.readFileSync(path.join(slidesDir, file), 'utf8');
  // Match all <a:t> text nodes
  const texts = [];
  const regex = /<a:t[^>]*>(.*?)<\/a:t>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1].trim()) texts.push(match[1].trim());
  }
  console.log(`\n=================== ${file} ===================`);
  console.log(texts.join(' | '));
}
