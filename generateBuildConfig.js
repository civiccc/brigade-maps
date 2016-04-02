var mapnik = require('mapnik')
var fs = require('fs');
var swig = require('swig');
var path = require('path');
var parse = require('csv-parse/lib/sync');
var glob = require('glob');

mapnik.register_default_input_plugins();


// Globals
// map configuration
var config = JSON.parse(fs.readFileSync('config/maps.json'));
// ocdids, indexed for fast lookup
var ocdidmaps = {}

var ocdIdKey = function(attributes) {
  return attributes.join('.')
}

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

var getTileOCDID = function(renderAttributes, mapName) {
  if (mapName in ocdidmaps) {
    return ocdidmaps[mapName][ocdIdKey(renderAttributes)]
  }
  return null;
}

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

      if (shouldSkip(config[map], feature)) {
        continue;
      }

      var datum = feature.attributes()
      var renderAttributes = []

      datum.shapefile = shapefile;

      config[map]['render_each'].forEach(function(i) {
        renderAttributes.push(datum[i])
      });

      var ocdid = getTileOCDID(renderAttributes, map, config[map]);
      var tileName = renderAttributes.join("-")

      for (level of config[map]['levels']) {
        var xmlPath = buildConfigDir + "/" + tileName + '_' + level + '.xml';

        datum.highlightColor = {
          federal: '#ffaf50',
          state: '#0196b4',
          local: '#3dc489'
        }[level]

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
