// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');

const buildIconsObject = require('./build-icons-object');

async function buildIconsJSON(inDir, outDir) {
  const OUT_FILE = path.join(outDir, './icons.json');
  fs.ensureFileSync(OUT_FILE);
  console.log(`Building ${OUT_FILE}...`);

  const svgFiles = fs.readdirSync(inDir).filter(file => path.extname(file) === '.svg');
  const getSvg = svgFile => fs.readFileSync(path.join(inDir, svgFile), 'utf8');

  const icons = buildIconsObject(svgFiles, getSvg);

  fs.writeFileSync(OUT_FILE, JSON.stringify(icons));
  return icons;
}

module.exports = buildIconsJSON;
