var mapnik = require('mapnik')
var fs = require('fs');
var swig = require('swig');
var path = require('path');
var parse = require('csv-parse/lib/sync');
var glob = require('glob');

mapnik.register_default_input_plugins();

const HIGHLIGHT_COLORS = {
  federal: '#ffaf50',
  state: '#0196b4',
  local: '#3dc489'
}

// Globals
// map configuration
var config = JSON.parse(fs.readFileSync('config/maps.json'));
// ocdids, indexed for fast lookup
var ocdidmaps = {}

// helper to transform the attributes from config['render_each'] into a hash key
var ocdIdKey = (attributes) => attributes.join('.')

// builds a hash from the ocdid_mapping file for quick ocdid lookups
var generateOcdIdMaps = function(mapName, config) {
  var mappingPath = path.join('config', mapName, 'ocdid_mapping.csv')
  if (!fs.existsSync(mappingPath)) {
    return null
  }

  ocdidmaps[mapName] = {}

  var rows = parse(fs.readFileSync(mappingPath), { comment: '#' })
  for (row of rows) {
    key = ocdIdKey(row.slice(0, config.render_each.length))
    ocdidmaps[mapName][key] = row[row.length - 1]
  }
}

// looks up an ocdid from its 'render each' attributes
var getTileOCDID = function(renderAttributes, mapName) {
  return ocdidmaps[mapName][ocdIdKey(renderAttributes)]
}

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
}

// output collection
var tiles = [];

Object.keys(config).forEach(function(map) {
  var buildConfigDir = "build/" + map;
  console.log("Generating config " + buildConfigDir)
  if (!fs.existsSync(buildConfigDir)) {
    fs.mkdirSync(buildConfigDir)
  }

  generateOcdIdMaps(map, config[map])

  var shapefiles = glob.sync(config[map]['shapefile']);
  for (shapefile of shapefiles) {
    var featureset = new mapnik.Datasource({ type: 'shape', file: shapefile }).featureset();
    var feature;

    while (feature = featureset.next()) {

      if (shouldSkip(config[map], feature)) { continue; }

      var datum = feature.attributes()
      var renderAttributes = config[map]['render_each'].map((attr) => datum[attr])

      // skip rendering of tiles without an ocdid, since we won't represent
      // them on brigade anywhere
      var ocdid = getTileOCDID(renderAttributes, map, config[map]);
      if (!ocdid) { continue}

      var tileName = renderAttributes.join("-")

      for (level of config[map]['levels']) {
        var xmlPath = buildConfigDir + "/" + tileName + '_' + level + '.xml';

        datum.highlightColor = HIGHLIGHT_COLORS[level]
        datum.shapefile = shapefile;

        fs.writeFileSync(xmlPath,
          swig.renderFile('config/' + map + '/stylesheet.xml.swig', datum)
        )

        tiles.push({
          xmlPath: xmlPath,
          ocdid: ocdid,
          level: level,
          extent: feature.extent()
        });
      }
    }
  }
});

fs.writeFileSync('build/tiles.json', JSON.stringify(tiles))
