'use strict';

const { optimize } = require('svgo');
const cheerio = require('cheerio');
const { format } = require('prettier');

const DEFAULT_ATTRS = require('./default-config').svgAttrs;

/**
 * Optimize SVG string.
 * @param {string} svg - An SVG string.
 * @param {object} config
 * @param {Promise<string>}
 */
function optimizeSvg(svg, config = {}) {
  return new Promise(resolve => {
    const result = optimize(svg, {
      plugins: [
        {
          name: 'convertShapeToPath',
          active: false,
        },
        {
          name: 'mergePaths',
          active: false,
        },
        { name: 'removeAttrs', params: { attrs: '(fill|stroke.*)' } },
        {
          name: 'removeTitle',
          active: true,
        },
      ],
    });
    resolve(result.data);
  })
    .then(svg => setAttrs(svg, config.svgAttrs))
    .then(code => format(code, { printWidth: 120, parser: 'html' }));
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
