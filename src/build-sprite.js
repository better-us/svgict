'use strict';

const fs = require('fs-extra');
const path = require('path');
const buildSpriteString = require('./build-sprite-string');

async function buildSprite(outDir, svgAttrs) {
  const icons = require(path.join(outDir, './icons.json'));
  const OUT_FILE = path.join(outDir, './sprite.svg');

  fs.ensureFileSync(OUT_FILE);
  console.log(`Building ${OUT_FILE}...`);

  fs.writeFileSync(OUT_FILE, buildSpriteString(icons, svgAttrs));
}

module.exports = buildSprite;
