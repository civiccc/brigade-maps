var mapnik = require('mapnik')
var fs = require('fs');
var swig = require('swig');

mapnik.register_default_input_plugins();

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

    var tileName = renderAttributes.join("-")
    var xmlPath = buildConfigDir + "/" + tileName + '.xml';
    fs.writeFileSync(xmlPath,
      swig.renderFile('config/' + map + '/stylesheet.xml.swig', datum)
    )

    tiles.push({
      name: tileName,
      configDir: buildConfigDir,
      extent: feature.extent()
    });
  }
});

fs.writeFileSync('build/tiles.json', JSON.stringify(tiles))
