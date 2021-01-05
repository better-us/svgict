// const fs = require('fs').promises;
const fs = require('fs-extra');
const path = require('path');
const dedent = require('dedent');
const camelcase = require('camelcase');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const { compile } = require('@vue/compiler-dom');

async function buildVue(inDir, outDir) {
  console.log('Building Vue components...');

  const svgFiles = fs.readdirSync(inDir).filter(file => path.extname(file) === '.svg');
  const getSvg = svgFile => fs.readFileSync(path.join(inDir, svgFile), { encoding: 'utf-8' });
  const svgToVue = svg => {
    return compile(svg, {
      mode: 'module',
    }).code;
  };

  return Promise.all(
    svgFiles.map(file => {
      const svg = getSvg(file);
      const component = svgToVue(svg);
      const fileName = `${camelcase(file.replace(/\.svg$/, ''), { pascalCase: true })}.js`;
      const content = dedent(component).replace('export function', 'export default function');
      return fs.writeFile(path.join(outDir, `./${fileName}`), content).then(() => fileName);
    }),
  )
    .then(fileNames => {
      const exportStatements = fileNames
        .map(fileName => {
          const componentName = fileName.replace(/\.js$/, '');
          return `export { default as ${componentName} } from './${fileName}'`;
        })
        .join('\n');

      return fs.writeFile(path.join(outDir, './index.js'), exportStatements);
    })
    .then(() => console.log('Finished building Vue components.'));
}

module.exports = buildVue;
