'use strict';

const pkg = require('../package.json');

const path = require('path');
const chalk = require('chalk');
const { cosmiconfigSync } = require('cosmiconfig');
const optimizeSvgFiles = require('./optimize-svg-files');
const buildIconsJSON = require('./build-icons-json');
const buildSprite = require('./build-sprite');
const buildReact = require('./build-react');
// const buildVue = require('./build-vue');
const DEFAULT_CONFIG = require('./default-config');
/**
 * Command-Option-Argument.
 *
 * @see https://github.com/veged/coa
 */
module.exports = require('coa')
  .Cmd()
  .helpful()
  .name(pkg.name)
  .title(pkg.description)

  .opt()
  .name('version')
  .title('Version')
  .short('v')
  .long('version')
  .only()
  .flag()
  .act(function () {
    // output the version to stdout instead of stderr if returned
    process.stdout.write(pkg.version + '\n');
    // coa will run `.toString` on the returned value and send it to stderr
    return '';
  })
  .end()

  .opt()
  .name('input')
  .title('Input folder')
  .short('i')
  .long('input')
  .val(function (val) {
    return val || this.reject("Option '--input' must have a value.");
  })
  .end()

  .opt()
  .name('output')
  .title('Output folder (by default the same as the input)')
  .short('o')
  .long('output')
  .val(function (val) {
    return val || this.reject("Option '--output' must have a value.");
  })
  .end()

  .opt()
  .name('config')
  .title('Config file or JSON string to extend or replace default')
  .short('c')
  .long('config')
  .val(function (val) {
    return val || this.reject("Option '--config' must have a value.");
  })
  .end()

  .opt()
  .name('quiet')
  .title('Only output error messages, not regular status messages')
  .short('q')
  .long('quiet')
  .flag()
  .end()

  .arg()
  .name('input')
  .title('Alias to --input')
  .end()

  .act(async function (opts, args) {
    console.log(`Reading options: `, opts);
    console.log(`Reading arguments: `, args);
    const input = opts.input || args.input;
    let output = opts.output;
    let config = {};

    // w/o anything
    if (!input && process.stdin.isTTY === true) {
      return this.usage();
    }

    if (typeof process === 'object' && process.versions && process.versions.node && pkg && pkg.engines.node) {
      var nodeVersion = String(pkg.engines.node).match(/\d+(\.\d+)*/)[0];
      if (parseFloat(process.versions.node) < parseFloat(nodeVersion)) {
        return printErrorAndExit(
          `Error: ${pkg.name} requires Node.js version ${pkg.engines.node}. Got ${process.versions.node}.`,
        );
      }
    }

    // --config
    try {
      // search for or directly load a configuration file.
      const explorer = cosmiconfigSync(pkg.name);
      if (opts.config) {
        // string
        if (opts.config.charAt(0) === '{') {
          try {
            config = JSON.parse(opts.config);
          } catch (e) {
            return printErrorAndExit(`Error: Couldn't parse config JSON.\n${String(e)}`);
          }
          // external file
        } else {
          const configPath = path.resolve(opts.config);
          const loaded = explorer.load(configPath);
          if (loaded && loaded.config) {
            config = loaded.config;
          }
        }
        // search config file
      } else {
        const searched = explorer.search();
        if (searched && searched.config) {
          config = searched.config;
        }
      }
      if (typeof config !== 'object' || Array.isArray(config)) {
        return printErrorAndExit(`Error: invalid config file '${config}'.`);
      }
      config = {
        ...DEFAULT_CONFIG,
        ...config,
        svgAttrs: {
          ...DEFAULT_CONFIG.svgAttrs,
          ...(config.svgAttrs || {}),
        },
      };
      console.log(`Reading config: `, config);
    } catch (err) {
      return printErrorAndExit(err.message);
    }

    // --quiet
    if (opts.quiet) {
      config.quiet = opts.quiet || config.quiet;
    }

    // --output
    if (!output) {
      output = input;
    }

    // action
    const inputDir = path.resolve(input);
    const outputDir = path.resolve(output);
    try {
      await optimizeSvgFiles(inputDir, config);
      buildIconsJSON(inputDir, outputDir);
      buildSprite(outputDir, config.svgAttrs);
      buildReact(outputDir, config);
      // buildVue(inputDir, outputDir);
    } catch (error) {
      return printErrorAndExit(error);
    }
  });

/**
 * Write an error and exit.
 * @param {Error} error
 * @return
 */
function printErrorAndExit(error) {
  console.error(chalk.red(error));
  process.exitCode = 1;
  // process.exit(1);
}
