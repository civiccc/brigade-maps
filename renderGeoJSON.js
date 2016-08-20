'use strict';

const fs = require('fs');

const simplify = require('simplify-geojson');
const geojsonhint = require('geojsonhint');

const buildConfig = require('./lib/buildConfig')();
const ocdidMappingProcessor = require('./lib/ocdidMappingProcessor');
const roundCoordinates = require('./lib/roundCoordinates');

module.exports = function() {
  buildConfig.eachMap((mapName, mapConfig) => {
    console.log('Generating GeoJSON files for ' + mapName);

    // load the OCDID translations for this map
    ocdidMappingProcessor.generateOcdIdMaps(mapName, mapConfig);

    mapConfig.eachFeature(feature => {
      const datum = feature.attributes();
      const renderAttributes = mapConfig.render_each.map((attr) => datum[attr]);
      const ocdid = ocdidMappingProcessor.getTileOCDID(renderAttributes, mapName);

      if (!ocdid) {
        return;
      }

      const featureAsGeoJSON = JSON.parse(feature.toJSON());
      // Simplify the feature's shape, so the resulting GeoJSON is a usably
      // small size.
      //
      // 0.02 is a hand-picked number -- it designates a tolerance in degrees
      // (1 degree = ~69 mi) of which smaller lines should be simplified. This
      // might require some tweaking.
      // See: https://www.npmjs.com/package/simplify-geojson
      const simplified = simplify(featureAsGeoJSON, 0.02).geometry;
      simplified.coordinates = roundCoordinates(simplified.coordinates);

      const hints = geojsonhint.hint(simplified);
      if (hints.find(hint => hint.level !== 'warn')) {
        console.log(hints);
        throw Error('Invalid GeoJSON for: ' + ocdid);
      }

      fs.writeFileSync('build/tmp.json', JSON.stringify(simplified));

      buildConfig.moveToOCDID('build/tmp.json', ocdid, 'geojson');
    });
  });
};
