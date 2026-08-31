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
for (const f of ['LiberationSans-Regular.ttf', 'LiberationSans-Bold.ttf', 'tahoma.ttf', 'tahomabold.ttf']) {
  pdfMake.virtualfs.writeFileSync(f, fs.readFileSync(path.join(FONT_DIR, f)));
}

pdfMake.setFonts({
  LiberationSans: {
    normal: 'LiberationSans-Regular.ttf',
    bold: 'LiberationSans-Bold.ttf',
    italics: 'LiberationSans-Regular.ttf',
    bolditalics: 'LiberationSans-Bold.ttf'
  },
  Tahoma: {
    normal: 'tahoma.ttf',
    bold: 'tahomabold.ttf',
    italics: 'tahoma.ttf',
    bolditalics: 'tahomabold.ttf'
  }
});

module.exports = pdfMake;
