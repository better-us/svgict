const Svgo = require('svgo');
const cheerio = require('cheerio');
const { format } = require('prettier');

const DEFAULT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

/**
 * Optimize SVG string.
 * @param {string} svg - An SVG string.
 * @param {object} config
 * @param {Promise<string>}
 */
function optimizeSvg(svg, config = {}) {
  return optimize(svg)
    .then(svg => setAttrs(svg, config.svgAttrs))
    .then(code => format(code, { printWidth: 120, parser: 'html' }));
}

/**
 * Optimize SVG with `svgo`.
 * @param {string} svg - An SVG string.
 * @returns {Promise<string>}
 */
function optimize(svg) {
  const svgo = new Svgo({
    plugins: [
      { convertShapeToPath: false },
      { mergePaths: false },
      { removeAttrs: { attrs: '(fill|stroke.*)' } },
      { removeTitle: true },
    ],
  });

  return new Promise(resolve => {
    svgo.optimize(svg, ({ data }) => resolve(data));
  });
}

/**
 * Set attributes on SVG.
 * @param {string} svg - An SVG string.
 * @param {svgAttrs} svg attributes
 * @returns {string}
 */
function setAttrs(svg, svgAttrs = {}) {
  const $ = cheerio.load(svg);
  const attrs = Object.assign({}, DEFAULT_ATTRS, svgAttrs);

  Object.keys(attrs).forEach(key => $('svg').attr(key, attrs[key]));

  return $('body').html();
}

module.exports = optimizeSvg;
