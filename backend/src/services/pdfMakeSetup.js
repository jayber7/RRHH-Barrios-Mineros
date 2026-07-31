const path = require('path');
const fs = require('fs');
const pdfMake = require('pdfmake');
const vfs = require('pdfmake/build/vfs_fonts');

pdfMake.setUrlAccessPolicy(() => false);
pdfMake.setLocalAccessPolicy(() => false);

for (const [name, content] of Object.entries(vfs)) {
  pdfMake.virtualfs.writeFileSync(name, Buffer.from(content, 'base64'));
}

const FONT_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
pdfMake.virtualfs.writeFileSync(
  'LiberationSans-Regular.ttf',
  fs.readFileSync(path.join(FONT_DIR, 'LiberationSans-Regular.ttf'))
);
pdfMake.virtualfs.writeFileSync(
  'LiberationSans-Bold.ttf',
  fs.readFileSync(path.join(FONT_DIR, 'LiberationSans-Bold.ttf'))
);

pdfMake.setFonts({
  LiberationSans: {
    normal: 'LiberationSans-Regular.ttf',
    bold: 'LiberationSans-Bold.ttf',
    italics: 'LiberationSans-Regular.ttf',
    bolditalics: 'LiberationSans-Bold.ttf'
  }
});

module.exports = pdfMake;
