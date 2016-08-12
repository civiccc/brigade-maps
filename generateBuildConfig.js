'use strict';

const fs = require('fs');

const mapnik = require('mapnik');
const swig = require('swig');

const buildConfig = require('./lib/buildConfig');
const ocdidMappingProcessor = require('./lib/ocdidMappingProcessor');

mapnik.register_default_input_plugins();

const HIGHLIGHT_COLORS = {
  federal: '#ffaf50',
  state: '#0196b4',
  local: '#3dc489'
};

// check if a feature matches any of the attributes in the skip list
// output collection
const tiles = [];

buildConfig().eachMap((mapName, mapConfig) => {
  const buildConfigDir = 'build/' + mapName;
  console.log('Generating config ' + buildConfigDir);
  if (!fs.existsSync(buildConfigDir)) {
    fs.mkdirSync(buildConfigDir);
  }

  ocdidMappingProcessor.generateOcdIdMaps(mapName, mapConfig);

  mapConfig.eachFeature((feature, shapefile) => {
    const datum = feature.attributes();
    const renderAttributes = mapConfig.render_each.map((attr) => datum[attr]);
    const tileName = renderAttributes.join('-');

    // skip rendering of tiles without an ocdid, since we won't represent
    // them on brigade anywhere
    const ocdid = ocdidMappingProcessor.getTileOCDID(renderAttributes, mapName);
    if (!ocdid) {
      return;
    }

    for (const level of mapConfig.levels) {
      const xmlPath = buildConfigDir + '/' + tileName + '_' + level + '.xml';

      datum.highlightColor = HIGHLIGHT_COLORS[level];
      datum.shapefile = shapefile;

      fs.writeFileSync(xmlPath,
        swig.renderFile('config/' + mapName + '/stylesheet.xml.swig', datum)
      );

      tiles.push({
        xmlPath: xmlPath,
        ocdid: ocdid,
        level: level,
        extent: mapConfig.extent(feature, ocdid),
      });
    }
  });
});

fs.writeFileSync('build/tiles.json', JSON.stringify(tiles));
