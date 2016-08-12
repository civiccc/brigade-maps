'use strict';

const glob = require('glob');
const mapnik = require('mapnik');

const shouldSkip = function(mapConfig, feature) {
  if (mapConfig.skip) {
    const datum = feature.attributes();

    for (const attr of Object.keys(mapConfig.skip)) {
      if (datum[attr] === mapConfig.skip[attr]) {
        return true;
      }
    }
  }
  return false;
};

module.exports = function(allMapConfigs, mapName) {
  const config = allMapConfigs[mapName] || {};
  const overrides = config.overrides || {};

  return Object.assign(config, {
    eachFeature(fn) {
      const shapefiles = glob.sync(config.shapefile);

      for (const shapefile of shapefiles) {
        const featureset = new mapnik.Datasource({ type: 'shape', file: shapefile }).featureset();
        let feature;

        // eslint-disable-next-line
        while (feature = featureset.next()) {
          if (shouldSkip(config, feature)) {
            continue;
          }

          fn(feature, shapefile);
        }
      }
    },

    extent(feature, ocdid) {
      return overrides[ocdid] || feature.extent();
    },
  });
};
