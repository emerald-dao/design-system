const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');

const path = `build/`;

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${path}...`);
fs.removeSync(path);

// Adding custom actions, transforms, and formats
const styleDictionary = StyleDictionary.extend({});

const modes = [`light`, `dark`];

console.log(`☀️ Building light mode...`);
styleDictionary
  .extend({
    source: [
      // this is saying find any files in the tokens folder
      // that does not have .dark or .light, but ends in .json
      `tokens/!(*.${modes.join(`|*.`)}).json`,
    ],

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
  })
  .buildAllPlatforms();

// Dark Mode
// we will only build the files we need to, we don't need to rebuild all the files
console.log(`\n\n🌙 Building dark mode...`);
styleDictionary
  .extend({
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
            format: `css/variables`,
            // only putting in the tokens from files with '.dark' in the filepath
            filter: (token) => token.filePath.indexOf(`dark`) > -1,
            options: {
              outputReferences: true,
            },
          },
        ],
      },
    },
  })
  .buildAllPlatforms();
