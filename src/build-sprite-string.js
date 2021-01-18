'use strict';
/**
 * Build an SVG sprite string containing SVG symbols.
 * @param {Object} icons
 * @returns {string}
 */
function buildSpriteString(icons, svgAttrs) {
  const symbols = Object.keys(icons)
    .map(icon => toSvgSymbol(icon, svgAttrs.viewBox, icons[icon]))
    .join('');

  return `<svg xmlns="${svgAttrs.xmlns}"><defs>${symbols}</defs></svg>`;
}

/**
 * Create an SVG symbol string.
 * @param {string} name - Icon name
 * @param {string} contents - SVG contents
 * @returns {string}
 */
function toSvgSymbol(name, viewBox, contents) {
  return `<symbol id="${name}" viewBox="${viewBox}">${contents}</symbol>`;
}

module.exports = buildSpriteString;
