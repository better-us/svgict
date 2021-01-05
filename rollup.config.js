import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from 'rollup-plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const getVersion = require('./scripts/version');
const pkg = require('./package.json');

async function getConfig() {
  const version = await getVersion();

  const config = {
    input: 'src/index.js',
    output: [
      { file: pkg.main, name: 'svgict', format: 'umd' },
      { file: pkg.module, format: 'es' },
    ],
    watch: {
      include: 'src/**',
    },
    plugins: [
      replace({
        __VERSION__: JSON.stringify(version),
      }),
      babel(),
      commonjs(),
      terser({
        include: [/^.+\.min\.js$/, '*umd*'],
      }),
    ],
  };
  return config;
}

export default getConfig();
