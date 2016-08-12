const ocdidMappingProcessor = require('./lib/ocdidMappingProcessor');

var fs = require('fs');

var glob = require('glob');
var mapnik = require('mapnik');
var swig = require('swig');

mapnik.register_default_input_plugins();

const HIGHLIGHT_COLORS = {
  federal: '#ffaf50',
  state: '#0196b4',
  local: '#3dc489'
};

// Globals
// map configuration
var config = JSON.parse(fs.readFileSync('config/maps.json'));

// check if a feature matches any of the attributes in the skip list
var shouldSkip = function(config, feature) {
  if (config['skip']) {
    var datum = feature.attributes();

    for (attr of Object.keys(config['skip'])) {
      if (datum[attr] == config['skip'][attr]) {
        return true;
      }
    }
  }
  return false;
};

// output collection
var tiles = [];

Object.keys(config).forEach(function(map) {
  var buildConfigDir = 'build/' + map;
  console.log('Generating config ' + buildConfigDir);
  if (!fs.existsSync(buildConfigDir)) {
    fs.mkdirSync(buildConfigDir);
  }

  ocdidMappingProcessor.generateOcdIdMaps(map, config[map]);

  var shapefiles = glob.sync(config[map]['shapefile']);
  var overrides = config[map]['overrides'] || {};

  for (const shapefile of shapefiles) {
    var featureset = new mapnik.Datasource({ type: 'shape', file: shapefile }).featureset();
    var feature;

    while (feature = featureset.next()) {

      if (shouldSkip(config[map], feature)) { continue; }

      var datum = feature.attributes();
      var renderAttributes = config[map]['render_each'].map((attr) => datum[attr]);

      // skip rendering of tiles without an ocdid, since we won't represent
      // them on brigade anywhere
      var ocdid = ocdidMappingProcessor.getTileOCDID(renderAttributes, map, config[map]);
      if (!ocdid) { continue;}

      var extent = overrides[ocdid] || feature.extent();
      var tileName = renderAttributes.join('-');

      for (level of config[map]['levels']) {
        var xmlPath = buildConfigDir + '/' + tileName + '_' + level + '.xml';

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
