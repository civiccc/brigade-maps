'use strict';

const fs = require('fs');
const spawn = require('child_process').spawnSync;

const buildConfig = require('./lib/buildConfig')();
const ocdidMappingProcessor = require('./lib/ocdidMappingProcessor');

module.exports = function(filterOcdid) {
  buildConfig.eachMap((mapName, mapConfig) => {
    console.log('Generating GeoJSON files for ' + mapName);

    // load the OCDID translations for this map
    ocdidMappingProcessor.generateOcdIdMaps(mapName, mapConfig);

    const simplifyLevel = mapConfig.geojson_simplify || '0.04'; // 4% of original features
    const precisionLevel = mapConfig.geojson_precision || 0.0001;

    mapConfig.eachFeature(feature => {
      const datum = feature.attributes();
      const renderAttributes = mapConfig.render_each.map((attr) => datum[attr]);
      const ocdid = ocdidMappingProcessor.getTileOCDID(renderAttributes, mapName);

      if (!ocdid || (filterOcdid && ocdid !== filterOcdid)) {
        return;
      }

      fs.writeFileSync('build/tmp.json', feature.geometry().toJSON());
      const simplify = spawn('node_modules/.bin/mapshaper',
        ['-i', 'build/tmp.json', '-simplify', 'visvalingam', simplifyLevel,
         '-o', 'build/tmp.json', 'force', 'precision=' + precisionLevel]
      );

      if (simplify.status !== 0) {
        console.error('ERROR Simplifying tile failed: ', ocdid);
        console.error(simplify.stderr);
        return;
      }

      // mapshaper encloses the geometry inside a GeometryCollection although
      // in practice we never have more than one element. This is wasteful of
      // space and breaks the assumptions of some clients (iOS).
      //
      // So, let's just grab the first geometry object.
      const justGeometry = JSON.parse(fs.readFileSync('build/tmp.json')).geometries[0];
      if (!justGeometry) {
        console.error('ERROR processing ' + ocdid + ': empty geometry');
      } else {
        fs.writeFileSync('build/tmp.json', JSON.stringify(justGeometry));
      }

      buildConfig.moveToOCDID('build/tmp.json', ocdid, 'geojson');
    });
  });
};
