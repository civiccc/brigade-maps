var mapnik = require('mapnik')
var fs = require('fs');
var swig = require('swig');

mapnik.register_default_input_plugins();

var config = JSON.parse(fs.readFileSync('config/maps.json'));
var tiles = [];

Object.keys(config).forEach(function(map) {
  var buildConfigDir = "build/config/" + map;
  console.log("Generating config " + buildConfigDir)
  if (!fs.existsSync(buildConfigDir)) {
    if (!fs.existsSync("build/config")) {
      fs.mkdirSync("build/config")
    }
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

    var renderDirectory = buildConfigDir + "/" + renderAttributes.join("-")
    if (!fs.existsSync(renderDirectory)) {
      fs.mkdirSync(renderDirectory)
    }

    fs.writeFileSync(
      renderDirectory + '/stylesheet.xml',
      swig.renderFile('config/' + map + '/stylesheet.xml.swig', datum)
    )

    tiles.push({ configDir: renderDirectory, extent: feature.extent() });
  }
});

fs.writeFileSync('build/config/tiles.json', JSON.stringify(tiles))
