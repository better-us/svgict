# _SVGICT_

*SVG I*con *C*rea*T*or. It is a svg icons component creator for react & vuejs.

[![NPM version](https://badge.fury.io/js/svgict.svg)](https://npmjs.org/package/svgict)

## Installation

```sh
$ [sudo] npm install -g svgict
```

## Usage

### <abbr title="Command Line Interface">CLI</abbr>

```
Simple svg icon creator

Usage:
  svgict [OPTIONS] [ARGS]


Options:
  -h, --help : Help
  -v, --version : Version
  -i INPUT, --input=INPUT : Input folder
  -o OUTPUT, --output=OUTPUT : Output folder (by default the same as the input)
  -c CONFIG, --config=CONFIG : Config file or JSON string to extend or replace default
  -q, --quiet : Only output error messages, not regular status messages

Arguments:
  INPUT : Alias to --input
```

```sh
$ npx svgict -i ../folder/with/svg/files -o ../folder/ouput
```

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/better-us/svgict/blob/main/LICENSE).
