const fs = require('fs');
const glob = require('glob');
const mapnik = require('mapnik');
const swig = require('swig');

const ocdidMappingProcessor = require('./lib/ocdidMappingProcessor');

mapnik.register_default_input_plugins();

const HIGHLIGHT_COLORS = {
  federal: '#ffaf50',
  state: '#0196b4',
  local: '#3dc489'
};

// Globals
// map configuration
const config = JSON.parse(fs.readFileSync('config/maps.json'));

// check if a feature matches any of the attributes in the skip list
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

// output collection
const tiles = [];

Object.keys(config).forEach(function(map) {
  const buildConfigDir = 'build/' + map;
  console.log('Generating config ' + buildConfigDir);
  if (!fs.existsSync(buildConfigDir)) {
    fs.mkdirSync(buildConfigDir);
  }

  ocdidMappingProcessor.generateOcdIdMaps(map, config[map]);

  const shapefiles = glob.sync(config[map].shapefile);
  const overrides = config[map].overrides || {};

  for (const shapefile of shapefiles) {
    const featureset = new mapnik.Datasource({ type: 'shape', file: shapefile }).featureset();
    let feature;

    // eslint-disable-next-line
    while (feature = featureset.next()) {

      if (shouldSkip(config[map], feature)) {
        continue;
      }

      const datum = feature.attributes();
      const renderAttributes = config[map].render_each.map((attr) => datum[attr]);

      // skip rendering of tiles without an ocdid, since we won't represent
      // them on brigade anywhere
      const ocdid = ocdidMappingProcessor.getTileOCDID(renderAttributes, map, config[map]);
      if (!ocdid) {
        continue;
      }

      const extent = overrides[ocdid] || feature.extent();
      const tileName = renderAttributes.join('-');

      for (const level of config[map].levels) {
        const xmlPath = buildConfigDir + '/' + tileName + '_' + level + '.xml';

        datum.highlightColor = HIGHLIGHT_COLORS[level];
        datum.shapefile = shapefile;

        fs.writeFileSync(xmlPath,
          swig.renderFile('config/' + map + '/stylesheet.xml.swig', datum)
        );

        tiles.push({
          xmlPath: xmlPath,
          ocdid: ocdid,
          level: level,
          extent: extent
        });
      }
    }
  }
});

fs.writeFileSync('build/tiles.json', JSON.stringify(tiles));
