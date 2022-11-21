const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');

const path = `build/`;

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${path}...`);
fs.removeSync(path);

StyleDictionary.registerFormat({
  name: 'css/variables/theme',
  formatter: function (dictionary, config) {
    return `${this.selector} {
      ${dictionary.allProperties.map((prop) => `  --${prop.name}: ${prop.original.value};`).join('\n')}
    }`;
  },
});

const modes = [`light`, `dark`];

console.log(`☀️ Building general variables...`);
StyleDictionary.extend({
  source: [`tokens/global.json`],
  transforms: ['attribute/cti', 'size/rem'],
  platforms: {
    css: {
      transformGroup: `css`,
      buildPath: path,
      files: [
        {
          destination: `variables.css`,
          format: `css/variables`,
          selector: ':root',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

console.log(`☀️ Building light mode...`);
StyleDictionary.extend({
  // Using the include array so that theme token overrides don't show
  // warnings in the console.
  // include: [`tokens/!(*.${modes.join(`|*.`)}).json`],
  source: [`tokens/light.json`],

  platforms: {
    css: {
      transformGroup: `css`,
      buildPath: path,
      files: [
        {
          destination: `variables-light.css`,
          format: `css/variables/theme`,
          selector: ':root[data-theme=light]',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

// Dark Mode
// we will only build the files we need to, we don't need to rebuild all the files
console.log(`\n\n🌙 Building dark mode...`);
StyleDictionary.extend({
  // Using the include array so that theme token overrides don't show
  // warnings in the console.
  include: [`tokens/!(*.${modes.join(`|*.`)}).json`],
  source: [`tokens/dark.json`],
  platforms: {
    css: {
      transformGroup: `css`,
      buildPath: path,
      files: [
        {
          destination: `variables-dark.css`,
          format: `css/variables/theme`,
          selector: ':root[data-theme=dark]',
          // only putting in the tokens from files with '.dark' in the filepath
          filter: (token) => token.filePath.indexOf(`dark`) > -1,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();
