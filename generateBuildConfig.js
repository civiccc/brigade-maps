var mapnik = require('mapnik')
var fs = require('fs');
var swig = require('swig');
var path = require('path');
var parse = require('csv-parse/lib/sync')

mapnik.register_default_input_plugins();

var getTileOCDID = function(renderAttributes, mapName) {
  var mappingPath = path.join('config', mapName, 'ocdid_mapping.csv')
  if (!fs.existsSync(mappingPath)) {
    return null
  }

  // TODO: make this not reload the file every time:
  var rows = parse(fs.readFileSync(mappingPath), { comment: '#' })

  for (row of rows) {
    // check for prefix match
    if (renderAttributes.every( (v,i) => row[i] == v)) {
      // ocdid expected to be in last column
      return row[row.length - 1];
    }
  }

  return null;
}

var config = JSON.parse(fs.readFileSync('config/maps.json'));
var tiles = [];

Object.keys(config).forEach(function(map) {
  var buildConfigDir = "build/" + map;
  console.log("Generating config " + buildConfigDir)
  if (!fs.existsSync(buildConfigDir)) {
    fs.mkdirSync(buildConfigDir)
  }

  var shapefile = config[map]['shapefile']
  var featureset = new mapnik.Datasource({ type: 'shape', file: shapefile }).featureset();
  var feature;

  while (feature = featureset.next()) {
    var datum = feature.attributes()
    var renderAttributes = []
    var skipRender = false

    if (config[map]['skip']) {
      var skipAttributes = Object.keys(config[map]['skip'])
      for (i in skipAttributes) {
        if (datum[skipAttributes[i]] == config[map]['skip'][skipAttributes[i]]) {
          skipRender = true
        }
      }
    }

    if (skipRender) {
      continue
    }

    config[map]['render_each'].forEach(function(i) {
      renderAttributes.push(datum[i])
    });

    var ocdid = getTileOCDID(renderAttributes, map);
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
});

fs.writeFileSync('build/tiles.json', JSON.stringify(tiles))
