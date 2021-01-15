/* eslint-env jest */
const buildSpriteString = require('../src/build-sprite-string');

const icons = {
  icon1: '<line x1="23" y1="1" x2="1" y2="23"></line><line x1="1" y1="1" x2="23" y2="23"></line>',
  icon2: '<circle cx="12" cy="12" r="11"></circle>',
};

const svgAttrs = {
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

test('builds sprite correctly', () => {
  expect(buildSpriteString(icons, svgAttrs)).toMatchSnapshot();
});
