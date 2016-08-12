const fs = require('fs');
const path = require('path');

const parseCsv = require('csv-parse/lib/sync');

const ocdidmaps = {};

module.exports = {
  // builds a hash from the ocdid_mapping file for quick ocdid lookups
  generateOcdIdMaps(mapName, mapConfig, basePath) {
    basePath = basePath || 'config';

    const mappingPath = path.join(basePath, mapName, 'ocdid_mapping.csv');
    if (!fs.existsSync(mappingPath)) {
      return null;
    }

    ocdidmaps[mapName] = {};

    const rows = parseCsv(fs.readFileSync(mappingPath), { comment: '#' });
    for (const row of rows) {
      const key = this._ocdIdKey(row.slice(0, mapConfig.render_each.length));
      ocdidmaps[mapName][key] = row[row.length - 1];
    }
  },

  // looks up an ocdid from its 'render each' attributes
  getTileOCDID(renderAttributes, mapName) {
    return ocdidmaps[mapName][this._ocdIdKey(renderAttributes)];
  },

  // helper to transform the attributes from config['render_each'] into a hash key
  _ocdIdKey(attributes) {
    return attributes.join('.');
  },
};
