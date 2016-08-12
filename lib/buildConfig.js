"use strict";

const fs = require('fs');
const path = require('path');

/**
 * @param {Object} options
 * @param {String} options.buildPath Root path to build tiles into
 * @return {Object}
 */
module.exports = function(options) {
  options = options || {};
  options.buildPath = options.buildPath || 'build/';

  return {
    moveToOCDID(tilePath, ocdid, level) {
      let buildPath = options.buildPath;

      for (const part of ocdid.split('/')) {
        buildPath = path.join(buildPath, part);
        if (!fs.existsSync(buildPath)) {
          fs.mkdirSync(buildPath);
        }
      }

      const outPath = path.join(buildPath, level + path.extname(tilePath));
      fs.renameSync(tilePath, outPath);
      return outPath;
    }
  };
};
