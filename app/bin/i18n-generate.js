const fs = require('fs');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;

const locales = { 'fr-fr': 'fr', 'en-en': 'en' };

const filePattern = './src/i18n/messages/**/*.json';
const outputDir = './src/i18n/locales/';

// schev
// Firstly. Use the correct syntax to write component needed to be translated. see examples
// Secondly in the app repository do : npm run build-message and npm run generate-locale
// It will create a file in app/src/i18n/locales that will be easy to translate.
// Current WARNING => running build18n will erase all the translation. Need to fix this

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const script = () => {
  console.log('in script');
  const defaultMessages = globSync(filePattern)
    .map(filename => fs.readFileSync(filename, 'utf8'))
    .map(file => JSON.parse(file))
    .reduce((collection, descriptors) => {
      descriptors.forEach(({id, defaultMessage}) => {
        if (!collection.hasOwnProperty(id)) {
          collection[id] = defaultMessage;
        }
      });

      return collection;
    }, {});
  // Create a new directory that we want to write the aggregate messages to
  mkdirpSync(outputDir);

  // Write the messages to this directory
  const messages = {};
  Object.keys(locales).forEach((l) => {
    messages[l] = defaultMessages;
  });
  fs.writeFileSync(`${outputDir}data.json`, JSON.stringify(messages, null, 2));
};

const readableStream = fs.createReadStream(`${outputDir}data.json`);
const writableStream = fs.createWriteStream(`${outputDir}${Date.now()}_data.json`);
readableStream.pipe(writableStream);
readableStream.on('end', () => {
  script();
});
