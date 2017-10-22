const getFileExtension = (filename) => {
  if (typeof filename !== typeof '') {
    throw new Error('hasValidExtension: filename must be a string.');
  }

  const extension = filename.match(/.*(\..+?)$/);
  if (extension !== null && extension.length === 2) {
    return extension[1].toLowerCase();
  }
  return '';
};

module.exports = getFileExtension;
