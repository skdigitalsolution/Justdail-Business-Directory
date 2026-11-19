const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Use Node's built-in or simple unzipper
const pptxPath = 'C:\\Users\\Home\\Downloads\\Justdial_Complete_Analysis_Roles_Pages_UI_Mockups.pptx';

// Let's see if we have adm-zip or similar, or use powershell Expand-Archive
console.log('PPTX Path exists:', fs.existsSync(pptxPath));
