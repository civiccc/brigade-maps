'use strict';

const fs = require('fs');
const path = require('path');

const mapConfig = require('./mapConfig');

/**
 * @param {Object} options
 * @param {String} options.buildPath Root path to build tiles into
 * @return {Object}
 */
module.exports = function(options) {
  options = options || {};
  options.buildPath = options.buildPath || 'build/';

  // Globals
  // map configuration
  const config = JSON.parse(fs.readFileSync('config/maps.json'));

  return {
    eachMap(fn) {
      Object.keys(config).forEach(mapName => fn(mapName, this.mapConfig(mapName)));
    },

    mapConfig(mapName) {
      return mapConfig(config, mapName);
    },

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
