const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');

const { formattedVariables } = StyleDictionary.formatHelpers;

const path = `build/`;

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${path}...`);
fs.removeSync(path);

StyleDictionary.registerFormat({
  name: 'css/variables/theme',
  transforms: ['attribute/cti'],
  formatter: function ({ dictionary, options }) {
    const { outputReferences } = options;
    return `${this.selector} {
      ${formattedVariables({ format: 'css', dictionary, outputReferences })}
    }`;
  },
});

console.log(`☀️ Building general variables...`);
StyleDictionary.extend({
  source: [`tokens/global.json`],
  transforms: ['attribute/cti'],
  platforms: {
    css: {
      transformGroup: `css`,
      buildPath: path,
      files: [
        {
          destination: `variables.css`,
          format: `css/variables`,
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
  source: [`tokens/light.json`],
  transforms: ['attribute/cti'],
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
console.log(`\n\n🌙 Building dark mode...`);
StyleDictionary.extend({
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
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();
